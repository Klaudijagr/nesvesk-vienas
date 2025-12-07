"use client";

import { useCallback, useRef, useState } from "react";
import { useFaceVerification } from "@/hooks/use-face-verification";

type FaceVerificationProps = {
  onVerificationComplete?: (verified: boolean, confidence: number) => void;
  onError?: (error: string) => void;
};

export function FaceVerification({
  onVerificationComplete,
  onError,
}: FaceVerificationProps) {
  const {
    isLoading,
    modelsLoaded,
    error,
    verificationResult,
    verifyImages,
    reset,
  } = useFaceVerification();

  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const [image1Preview, setImage1Preview] = useState<string | null>(null);
  const [image2Preview, setImage2Preview] = useState<string | null>(null);

  const input1Ref = useRef<HTMLInputElement>(null);
  const input2Ref = useRef<HTMLInputElement>(null);

  const handleImageChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      setImage: (file: File | null) => void,
      setPreview: (url: string | null) => void
    ) => {
      const file = e.target.files?.[0];
      if (file) {
        setImage(file);
        const url = URL.createObjectURL(file);
        setPreview(url);
      }
    },
    []
  );

  const handleVerify = useCallback(async () => {
    if (!(image1 && image2)) {
      onError?.("Please select both images");
      return;
    }

    reset();
    const result = await verifyImages(image1, image2);

    if (result) {
      onVerificationComplete?.(result.verified, result.confidence);
    } else if (error) {
      onError?.(error);
    }
  }, [
    image1,
    image2,
    verifyImages,
    reset,
    onVerificationComplete,
    onError,
    error,
  ]);

  const handleReset = useCallback(() => {
    setImage1(null);
    setImage2(null);
    setImage1Preview(null);
    setImage2Preview(null);
    if (input1Ref.current) {
      input1Ref.current.value = "";
    }
    if (input2Ref.current) {
      input2Ref.current.value = "";
    }
    reset();
  }, [reset]);

  return (
    <div className="space-y-6 p-4">
      <div className="text-center">
        <h2 className="font-semibold text-xl">Face Verification</h2>
        <p className="text-gray-600 text-sm">
          Upload two photos to verify they are the same person
        </p>
        {!modelsLoaded && (
          <p className="text-amber-600 text-sm">
            Loading face detection models...
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Image 1 */}
        <div className="space-y-2">
          <span className="block font-medium text-sm">ID Document</span>
          <div className="relative h-48 rounded-lg border-2 border-gray-300 border-dashed bg-gray-50">
            {image1Preview ? (
              <img
                alt="ID document preview"
                className="h-full w-full rounded-lg object-contain"
                height={192}
                src={image1Preview}
                width={192}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-gray-400">Click to upload</span>
              </div>
            )}
            <input
              accept="image/jpeg,image/png,image/webp"
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={(e) =>
                handleImageChange(e, setImage1, setImage1Preview)
              }
              ref={input1Ref}
              type="file"
            />
          </div>
        </div>

        {/* Image 2 */}
        <div className="space-y-2">
          <span className="block font-medium text-sm">Selfie</span>
          <div className="relative h-48 rounded-lg border-2 border-gray-300 border-dashed bg-gray-50">
            {image2Preview ? (
              <img
                alt="Selfie"
                className="h-full w-full rounded-lg object-contain"
                height={192}
                src={image2Preview}
                width={192}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-gray-400">Click to upload</span>
              </div>
            )}
            <input
              accept="image/jpeg,image/png,image/webp"
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={(e) =>
                handleImageChange(e, setImage2, setImage2Preview)
              }
              ref={input2Ref}
              type="file"
            />
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Result display */}
      {verificationResult && (
        <div
          className={`rounded-md p-4 ${
            verificationResult.verified
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          <div className="font-semibold">
            {verificationResult.verified ? "Match Found!" : "No Match"}
          </div>
          <div className="text-sm">
            Confidence: {(verificationResult.confidence * 100).toFixed(1)}%
          </div>
          <div className="mt-1 text-xs opacity-75">
            Distance: {verificationResult.details.euclideanDistance.toFixed(3)}
            (threshold: {verificationResult.details.threshold})
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          className="flex-1 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          disabled={!(image1 && image2) || isLoading || !modelsLoaded}
          onClick={handleVerify}
          type="button"
        >
          {isLoading ? "Verifying..." : "Verify Faces"}
        </button>
        <button
          className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
          onClick={handleReset}
          type="button"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
