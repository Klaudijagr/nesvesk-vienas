"""Face Verification Service using EdgeFace-XXS + YuNet."""
import cv2
import numpy as np
import onnxruntime as ort
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from loguru import logger
from pathlib import Path

app = FastAPI(title="Face Verification Service (EdgeFace)", version="2.0.0")
logger.info("Starting Face Verification Service with EdgeFace-XXS")

# Model paths
MODELS_DIR = Path(__file__).parent / "models"
DETECTOR_PATH = MODELS_DIR / "face_detection_yunet_2023mar.onnx"
EDGEFACE_PATH = MODELS_DIR / "edgeface_xxs.onnx"

# Initialize models (lazy loading)
_detector = None
_recognizer = None


def get_detector(input_size=(320, 320)):
    global _detector
    if _detector is None or _detector.getInputSize() != input_size:
        _detector = cv2.FaceDetectorYN.create(
            str(DETECTOR_PATH),
            "",
            input_size,
            score_threshold=0.9,
            nms_threshold=0.3,
            top_k=5000
        )
    return _detector


def get_recognizer():
    global _recognizer
    if _recognizer is None:
        _recognizer = ort.InferenceSession(
            str(EDGEFACE_PATH),
            providers=['CPUExecutionProvider']
        )
        logger.info(f"Loaded EdgeFace model, input: {_recognizer.get_inputs()[0].shape}")
    return _recognizer


def load_image(file_bytes: bytes) -> np.ndarray:
    """Load image from bytes."""
    nparr = np.frombuffer(file_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode image")
    return img


def align_face(img: np.ndarray, face: np.ndarray, target_size: int = 112) -> np.ndarray:
    """Align and crop face to 112x112 for EdgeFace.

    Uses the 5 facial landmarks from YuNet:
    - Right eye, Left eye, Nose tip, Right mouth corner, Left mouth corner
    """
    # Extract landmarks from YuNet detection
    # face format: [x, y, w, h, x_re, y_re, x_le, y_le, x_nt, y_nt, x_rcm, y_rcm, x_lcm, y_lcm, score]
    landmarks = np.array([
        [face[4], face[5]],   # Right eye
        [face[6], face[7]],   # Left eye
        [face[8], face[9]],   # Nose tip
        [face[10], face[11]], # Right mouth corner
        [face[12], face[13]], # Left mouth corner
    ], dtype=np.float32)

    # Standard landmark positions for 112x112 aligned face (ArcFace alignment)
    dst_landmarks = np.array([
        [38.2946, 51.6963],
        [73.5318, 51.5014],
        [56.0252, 71.7366],
        [41.5493, 92.3655],
        [70.7299, 92.2041]
    ], dtype=np.float32)

    # Compute similarity transform
    tform = cv2.estimateAffinePartial2D(landmarks, dst_landmarks)[0]

    # Apply transform
    aligned = cv2.warpAffine(img, tform, (target_size, target_size))

    return aligned


def preprocess_face(aligned_face: np.ndarray) -> np.ndarray:
    """Preprocess aligned face for EdgeFace model."""
    # Convert BGR to RGB
    rgb = cv2.cvtColor(aligned_face, cv2.COLOR_BGR2RGB)

    # Normalize to [-1, 1] (same as torchvision normalize with mean=0.5, std=0.5)
    normalized = (rgb.astype(np.float32) / 255.0 - 0.5) / 0.5

    # CHW format and add batch dimension
    chw = np.transpose(normalized, (2, 0, 1))
    batched = np.expand_dims(chw, axis=0)

    return batched


def detect_face(img: np.ndarray) -> tuple[np.ndarray | None, np.ndarray | None]:
    """Detect face and return face bbox and aligned face."""
    h, w = img.shape[:2]
    detector = get_detector((w, h))
    detector.setInputSize((w, h))

    _, faces = detector.detect(img)

    if faces is None or len(faces) == 0:
        return None, None

    # Get the largest face (most likely the main subject)
    face = max(faces, key=lambda f: f[2] * f[3])

    # Align face for EdgeFace (112x112)
    aligned_face = align_face(img, face)

    return face, aligned_face


def get_embedding(aligned_face: np.ndarray) -> np.ndarray:
    """Extract face embedding from aligned face using EdgeFace."""
    recognizer = get_recognizer()

    # Preprocess
    input_tensor = preprocess_face(aligned_face)

    # Run inference
    input_name = recognizer.get_inputs()[0].name
    embedding = recognizer.run(None, {input_name: input_tensor})[0]

    # Normalize embedding (L2 normalization for cosine similarity)
    embedding = embedding / np.linalg.norm(embedding)

    return embedding


def compare_embeddings(emb1: np.ndarray, emb2: np.ndarray) -> dict:
    """Compare two face embeddings using cosine similarity."""
    # Cosine similarity (embeddings are already L2 normalized)
    cosine_score = float(np.dot(emb1.flatten(), emb2.flatten()))

    # L2 distance
    l2_distance = float(np.linalg.norm(emb1 - emb2))

    # Thresholds (tuned for EdgeFace - may need adjustment)
    cosine_threshold = 0.4  # Higher = stricter
    l2_threshold = 1.0      # Lower = stricter

    return {
        "cosine_score": cosine_score,
        "cosine_threshold": cosine_threshold,
        "l2_distance": l2_distance,
        "l2_threshold": l2_threshold,
        "match_cosine": cosine_score >= cosine_threshold,
        "match_l2": l2_distance <= l2_threshold,
        "verified": cosine_score >= cosine_threshold
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {
        "status": "ok",
        "model": "EdgeFace-XXS",
        "embedding_size": 512,
        "models_loaded": _detector is not None and _recognizer is not None
    }


@app.post("/detect")
async def detect(image: UploadFile = File(...)):
    """Detect face in an image and return bounding box."""
    try:
        contents = await image.read()
        img = load_image(contents)
        face, aligned = detect_face(img)

        if face is None:
            return JSONResponse(
                status_code=400,
                content={"error": "No face detected", "face_found": False}
            )

        return {
            "face_found": True,
            "bbox": {
                "x": int(face[0]),
                "y": int(face[1]),
                "width": int(face[2]),
                "height": int(face[3])
            },
            "confidence": float(face[14]) if len(face) > 14 else None
        }
    except Exception as e:
        logger.exception("Detection error")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/embedding")
async def embedding(image: UploadFile = File(...)):
    """Extract face embedding from an image."""
    try:
        contents = await image.read()
        img = load_image(contents)
        face, aligned = detect_face(img)

        if face is None:
            return JSONResponse(
                status_code=400,
                content={"error": "No face detected", "face_found": False}
            )

        emb = get_embedding(aligned)

        return {
            "face_found": True,
            "embedding": emb.flatten().tolist(),
            "embedding_size": len(emb.flatten())
        }
    except Exception as e:
        logger.exception("Embedding error")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/verify")
async def verify(
    image1: UploadFile = File(..., description="First image (e.g., ID photo)"),
    image2: UploadFile = File(..., description="Second image (e.g., selfie)")
):
    """Verify if two images contain the same person."""
    try:
        # Load both images
        contents1 = await image1.read()
        contents2 = await image2.read()

        img1 = load_image(contents1)
        img2 = load_image(contents2)

        # Detect faces
        face1, aligned1 = detect_face(img1)
        face2, aligned2 = detect_face(img2)

        if face1 is None:
            return JSONResponse(
                status_code=400,
                content={"error": "No face detected in first image", "image": "image1"}
            )

        if face2 is None:
            return JSONResponse(
                status_code=400,
                content={"error": "No face detected in second image", "image": "image2"}
            )

        # Get embeddings
        emb1 = get_embedding(aligned1)
        emb2 = get_embedding(aligned2)

        # Compare
        result = compare_embeddings(emb1, emb2)

        return {
            "verified": result["verified"],
            "confidence": result["cosine_score"],
            "details": result
        }
    except Exception as e:
        logger.exception("Verification error")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001)
