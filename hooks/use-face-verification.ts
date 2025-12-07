"use client";

import { useCallback, useEffect, useState } from "react";
import type { VerificationResult } from "@/lib/face-verification";

export type UseFaceVerificationOptions = {
  modelPath?: string;
  autoLoadModels?: boolean;
};

export type UseFaceVerificationReturn = {
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
};

export function useFaceVerification(
  options: UseFaceVerificationOptions = {}
): UseFaceVerificationReturn {
  const { modelPath = "/models", autoLoadModels = true } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);

  // Load models on mount if autoLoadModels is true
  useEffect(() => {
    if (autoLoadModels && !modelsLoaded) {
      // Dynamic import to avoid SSR issues
      import("@/lib/face-verification").then(
        ({ loadModels, areModelsLoaded }) => {
          if (areModelsLoaded()) {
            setModelsLoaded(true);
            return;
          }
          loadModels(modelPath)
            .then(() => setModelsLoaded(true))
            .catch((err) => setError(`Failed to load models: ${err.message}`));
        }
      );
    }
  }, [autoLoadModels, modelPath, modelsLoaded]);

  const handleLoadModels = useCallback(async () => {
    if (modelsLoaded) {
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const { loadModels } = await import("@/lib/face-verification");
      await loadModels(modelPath);
      setModelsLoaded(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(`Failed to load models: ${message}`);
    } finally {
      setIsLoading(false);
    }
  }, [modelPath, modelsLoaded]);

  const verifyImages = useCallback(
    async (
      image1: File | Blob | string,
      image2: File | Blob | string
    ): Promise<VerificationResult | null> => {
      setIsLoading(true);
      setError(null);
      setVerificationResult(null);

      try {
        const {
          loadModels,
          createImageFromUrl,
          createImageFromBlob,
          verifyFaces,
        } = await import("@/lib/face-verification");

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

        if (!result.success) {
          setError(result.error);
          return null;
        }

        setVerificationResult(result.result);
        return result.result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(`Verification failed: ${message}`);
        return null;
      } finally {
        setIsLoading(false);
      }
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
}
