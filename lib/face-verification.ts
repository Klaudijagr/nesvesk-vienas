/**
 * Face Verification Library using @vladmandic/face-api
 *
 * Provides face detection, embedding extraction, and verification
 * for comparing two photos (e.g., ID photo vs selfie).
 *
 * Uses dynamic imports to avoid SSR issues with TextEncoder.
 */

import type * as FaceApi from "@vladmandic/face-api";

// Configuration
// Higher = stricter matching
const _COSINE_THRESHOLD = 0.4;
// Lower = stricter matching (face-api uses 0.6 as default)
const L2_THRESHOLD = 0.6;

let faceapi: typeof FaceApi | null = null;
let modelsLoaded = false;

export interface FaceDetectionResult {
  faceFound: boolean;
  box?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence?: number;
  descriptor?: Float32Array;
}

export interface VerificationResult {
  verified: boolean;
  confidence: number;
  details: {
    euclideanDistance: number;
    threshold: number;
    matchL2: boolean;
  };
}

/**
 * Dynamically load face-api module (client-side only)
 */
const getFaceApi = async () => {
  if (faceapi) {
    return faceapi;
  }

  // Dynamic import to avoid SSR issues
  faceapi = await import("@vladmandic/face-api");
  return faceapi;
};

/**
 * Load face-api.js models from the public directory.
 * Models should be placed in /public/models/
 */
export const loadModels = async (modelPath = "/models"): Promise<void> => {
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
};

/**
 * Check if models are loaded
 */
export const areModelsLoaded = (): boolean => modelsLoaded;

/**
 * Detect a face in an image and extract its descriptor (embedding).
 */
export const detectFace = async (
  input: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
): Promise<FaceDetectionResult> => {
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
};

/**
 * Compare two face descriptors and determine if they match.
 */
export const compareDescriptors = async (
  descriptor1: Float32Array,
  descriptor2: Float32Array
): Promise<VerificationResult> => {
  const api = await getFaceApi();

  // Euclidean distance (L2) - face-api.js uses this by default
  const distance = api.euclideanDistance(descriptor1, descriptor2);

  const matchL2 = distance <= L2_THRESHOLD;

  return {
    verified: matchL2,
    // Convert distance to similarity score
    confidence: Math.max(0, 1 - distance),
    details: {
      euclideanDistance: distance,
      threshold: L2_THRESHOLD,
      matchL2,
    },
  };
};

/**
 * Verify if two images contain the same person.
 */
export const verifyFaces = async (
  image1: HTMLImageElement | HTMLCanvasElement,
  image2: HTMLImageElement | HTMLCanvasElement
): Promise<
  | { success: true; result: VerificationResult }
  | { success: false; error: string; image?: "image1" | "image2" }
> => {
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
};

// Load and decode an image element; `decode()` settles once the image is usable.
const loadImage = async (
  src: string,
  errorMessage: string
): Promise<HTMLImageElement> => {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = src;
  try {
    await img.decode();
  } catch {
    throw new Error(errorMessage);
  }
  return img;
};

/**
 * Create an HTMLImageElement from a File or Blob.
 */
export const createImageFromBlob = async (
  blob: Blob
): Promise<HTMLImageElement> => {
  const url = URL.createObjectURL(blob);
  try {
    return await loadImage(url, "Failed to load image");
  } finally {
    URL.revokeObjectURL(url);
  }
};

/**
 * Create an HTMLImageElement from a URL.
 */
export const createImageFromUrl = async (
  url: string
): Promise<HTMLImageElement> =>
  await loadImage(url, "Failed to load image from URL");
