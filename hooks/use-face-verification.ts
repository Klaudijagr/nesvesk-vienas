"use client";

import { useCallback, useEffect, useState } from "react";

import type { VerificationResult } from "@/lib/face-verification";

export interface UseFaceVerificationOptions {
  modelPath?: string;
  autoLoadModels?: boolean;
}

export interface UseFaceVerificationReturn {
  isLoading: boolean;
  modelsLoaded: boolean;
  error: string | null;
  verificationResult: VerificationResult | null;
  loadModels: () => Promise<void>;
  verifyImages: (
    image1: File | Blob | string,
    image2: File | Blob | string
  ) => Promise<VerificationResult | null>;
  reset: () => void;
}

// Loaded on demand (outside the hook) so the face-api bundle never runs during SSR.
const importFaceVerification = async () =>
  await import("@/lib/face-verification");

const describeError = (error: unknown): string =>
  error instanceof Error ? error.message : "Unknown error";

export const useFaceVerification = (
  options: UseFaceVerificationOptions = {}
): UseFaceVerificationReturn => {
  const { modelPath = "/models", autoLoadModels = true } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);

  // Load models on mount if autoLoadModels is true
  useEffect(() => {
    if (!autoLoadModels || modelsLoaded) {
      return;
    }
    const autoLoad = async () => {
      const { loadModels, areModelsLoaded } = await importFaceVerification();
      if (areModelsLoaded()) {
        setModelsLoaded(true);
        return;
      }
      try {
        await loadModels(modelPath);
        setModelsLoaded(true);
      } catch (error_) {
        const message =
          error_ instanceof Error ? error_.message : String(error_);
        setError(`Failed to load models: ${message}`);
      }
    };
    void autoLoad();
  }, [autoLoadModels, modelPath, modelsLoaded]);

  const handleLoadModels = useCallback(async () => {
    if (modelsLoaded) {
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const { loadModels } = await importFaceVerification();
      await loadModels(modelPath);
      setModelsLoaded(true);
    } catch (error_) {
      setError(`Failed to load models: ${describeError(error_)}`);
    }
    setIsLoading(false);
  }, [modelPath, modelsLoaded]);

  const verifyImages = useCallback(
    async (
      image1: File | Blob | string,
      image2: File | Blob | string
    ): Promise<VerificationResult | null> => {
      setIsLoading(true);
      setError(null);
      setVerificationResult(null);

      let verified: VerificationResult | null = null;
      try {
        const {
          loadModels,
          createImageFromUrl,
          createImageFromBlob,
          verifyFaces,
        } = await importFaceVerification();

        // Ensure models are loaded
        if (!modelsLoaded) {
          await loadModels(modelPath);
          setModelsLoaded(true);
        }

        // Convert inputs to HTMLImageElement
        const img1 =
          typeof image1 === "string"
            ? await createImageFromUrl(image1)
            : await createImageFromBlob(image1);

        const img2 =
          typeof image2 === "string"
            ? await createImageFromUrl(image2)
            : await createImageFromBlob(image2);

        // Perform verification
        const result = await verifyFaces(img1, img2);

        if (result.success) {
          setVerificationResult(result.result);
          verified = result.result;
        } else {
          setError(result.error);
        }
      } catch (error_) {
        setError(`Verification failed: ${describeError(error_)}`);
      }
      setIsLoading(false);
      return verified;
    },
    [modelPath, modelsLoaded]
  );

  const reset = useCallback(() => {
    setError(null);
    setVerificationResult(null);
  }, []);

  return {
    isLoading,
    modelsLoaded,
    error,
    verificationResult,
    loadModels: handleLoadModels,
    verifyImages,
    reset,
  };
};
