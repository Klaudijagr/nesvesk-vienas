/**
 * Face Verification Library using @vladmandic/face-api
 *
 * Provides face detection, embedding extraction, and verification
 * for comparing two photos (e.g., ID photo vs selfie).
 *
 * Uses dynamic imports to avoid SSR issues with TextEncoder.
 */

// Configuration
const _COSINE_THRESHOLD = 0.4; // Higher = stricter matching
const L2_THRESHOLD = 0.6; // Lower = stricter matching (face-api uses 0.6 as default)

let faceapi: typeof import("@vladmandic/face-api") | null = null;
let modelsLoaded = false;

export type FaceDetectionResult = {
  faceFound: boolean;
  box?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence?: number;
  descriptor?: Float32Array;
};

export type VerificationResult = {
  verified: boolean;
  confidence: number;
  details: {
    euclideanDistance: number;
    threshold: number;
    matchL2: boolean;
  };
};

/**
 * Dynamically load face-api module (client-side only)
 */
async function getFaceApi() {
  if (faceapi) {
    return faceapi;
  }

  // Dynamic import to avoid SSR issues
  faceapi = await import("@vladmandic/face-api");
  return faceapi;
}

/**
 * Load face-api.js models from the public directory.
 * Models should be placed in /public/models/
 */
export async function loadModels(modelPath = "/models"): Promise<void> {
  if (modelsLoaded) {
    return;
  }

  const api = await getFaceApi();

  await Promise.all([
    api.nets.ssdMobilenetv1.loadFromUri(modelPath),
    api.nets.faceLandmark68Net.loadFromUri(modelPath),
    api.nets.faceRecognitionNet.loadFromUri(modelPath),
  ]);

  modelsLoaded = true;
}

/**
 * Check if models are loaded
 */
export function areModelsLoaded(): boolean {
  return modelsLoaded;
}

/**
 * Detect a face in an image and extract its descriptor (embedding).
 */
export async function detectFace(
  input: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
): Promise<FaceDetectionResult> {
  if (!modelsLoaded) {
    throw new Error("Models not loaded. Call loadModels() first.");
  }

  const api = await getFaceApi();

  const detection = await api
    .detectSingleFace(input)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) {
    return { faceFound: false };
  }

  const { box } = detection.detection;
  return {
    faceFound: true,
    box: {
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
    },
    confidence: detection.detection.score,
    descriptor: detection.descriptor,
  };
}

/**
 * Compare two face descriptors and determine if they match.
 */
export async function compareDescriptors(
  descriptor1: Float32Array,
  descriptor2: Float32Array
): Promise<VerificationResult> {
  const api = await getFaceApi();

  // Euclidean distance (L2) - face-api.js uses this by default
  const distance = api.euclideanDistance(descriptor1, descriptor2);

  const matchL2 = distance <= L2_THRESHOLD;

  return {
    verified: matchL2,
    confidence: Math.max(0, 1 - distance), // Convert distance to similarity score
    details: {
      euclideanDistance: distance,
      threshold: L2_THRESHOLD,
      matchL2,
    },
  };
}

/**
 * Verify if two images contain the same person.
 */
export async function verifyFaces(
  image1: HTMLImageElement | HTMLCanvasElement,
  image2: HTMLImageElement | HTMLCanvasElement
): Promise<
  | { success: true; result: VerificationResult }
  | { success: false; error: string; image?: "image1" | "image2" }
> {
  if (!modelsLoaded) {
    await loadModels();
  }

  const detection1 = await detectFace(image1);
  if (!(detection1.faceFound && detection1.descriptor)) {
    return {
      success: false,
      error: "No face detected in first image",
      image: "image1",
    };
  }

  const detection2 = await detectFace(image2);
  if (!(detection2.faceFound && detection2.descriptor)) {
    return {
      success: false,
      error: "No face detected in second image",
      image: "image2",
    };
  }

  const result = await compareDescriptors(
    detection1.descriptor,
    detection2.descriptor
  );

  return { success: true, result };
}

/**
 * Create an HTMLImageElement from a File or Blob.
 */
export function createImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

/**
 * Create an HTMLImageElement from a URL.
 */
export function createImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image from URL"));

    img.src = url;
  });
}
