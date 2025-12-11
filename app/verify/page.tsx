"use client";

import { useMutation, useQuery } from "convex/react";
import {
  AlertCircle,
  Camera,
  CheckCircle,
  CreditCard,
  Loader2,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useFaceVerification } from "@/hooks/use-face-verification";

type VerificationState = "idle" | "verifying" | "success" | "failed";

// Camera error messages mapped by error name
const CAMERA_ERROR_MESSAGES: Record<string, string> = {
  NotAllowedError:
    "Camera access was denied. To enable it:\n" +
    "• Click the camera/lock icon in your browser's address bar\n" +
    "• Select 'Allow' for camera access\n" +
    "• Refresh this page and try again",
  PermissionDeniedError:
    "Camera access was denied. To enable it:\n" +
    "• Click the camera/lock icon in your browser's address bar\n" +
    "• Select 'Allow' for camera access\n" +
    "• Refresh this page and try again",
  NotFoundError:
    "No camera found. Please ensure your device has a camera connected and try again.",
  DevicesNotFoundError:
    "No camera found. Please ensure your device has a camera connected and try again.",
  NotReadableError:
    "Camera is in use by another application. Please close other apps using the camera and try again.",
  TrackStartError:
    "Camera is in use by another application. Please close other apps using the camera and try again.",
};

const DEFAULT_CAMERA_ERROR =
  "Could not access camera. Please check that:\n" +
  "• Your browser has permission to use the camera\n" +
  "• No other application is using the camera\n" +
  "• Your device has a working camera";

// Helper to get camera error message
function getCameraErrorMessage(err: unknown): string {
  const errorName = err instanceof Error ? err.name : "";
  return CAMERA_ERROR_MESSAGES[errorName] ?? DEFAULT_CAMERA_ERROR;
}

// Loading state component
function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-red-600" />
    </div>
  );
}

// Already verified state
function AlreadyVerifiedState() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-lg px-4">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <ShieldCheck className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="mb-2 font-bold text-2xl text-gray-900">
              Already Verified
            </h2>
            <p className="mb-6 text-gray-600">
              Your identity has been verified. You can now fully participate in
              the platform.
            </p>
            <Link href="/browse">
              <Button>Go to Browse</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Success state
function SuccessState({ confidence }: { confidence?: number }) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="mb-2 font-bold text-2xl text-green-700">
          Verification Successful!
        </h2>
        <p className="mb-2 text-gray-600">
          Your identity has been verified. You now have a verified badge on your
          profile.
        </p>
        {confidence !== undefined && (
          <p className="mb-6 text-gray-500 text-sm">
            Face match confidence: {(confidence * 100).toFixed(1)}%
          </p>
        )}
        <Link href="/browse">
          <Button>Go to Browse</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// ID Photo card
function IdPhotoCard({
  preview,
  onSelect,
  onClear,
  inputRef,
}: {
  preview: string | null;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CreditCard className="h-5 w-5" />
          ID Photo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <input
          accept="image/*"
          className="hidden"
          onChange={onSelect}
          ref={inputRef}
          type="file"
        />
        {preview ? (
          <div className="relative">
            <Image
              alt="ID preview"
              className="h-48 w-full rounded-lg object-cover"
              height={192}
              src={preview}
              width={320}
            />
            <button
              className="absolute top-2 right-2 rounded-full bg-white p-1 shadow-md hover:bg-gray-100"
              onClick={onClear}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            className="flex h-48 w-full flex-col items-center justify-center rounded-lg border-2 border-gray-300 border-dashed transition-colors hover:border-red-400 hover:bg-red-50"
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            <Upload className="mb-2 h-8 w-8 text-gray-400" />
            <span className="text-gray-600 text-sm">Upload ID photo</span>
            <span className="text-gray-400 text-xs">JPG, PNG up to 10MB</span>
          </button>
        )}
      </CardContent>
    </Card>
  );
}

// Selfie card
function SelfieCard({
  showCamera,
  preview,
  videoRef,
  onStartCamera,
  onCapture,
  onStopCamera,
  onClear,
}: {
  showCamera: boolean;
  preview: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onStartCamera: () => void;
  onCapture: () => void;
  onStopCamera: () => void;
  onClear: () => void;
}) {
  const renderContent = () => {
    if (showCamera) {
      return (
        <div className="relative">
          <video
            autoPlay
            className="h-48 w-full rounded-lg object-cover"
            muted
            playsInline
            ref={videoRef}
          />
          <div className="absolute inset-x-0 bottom-2 flex justify-center gap-2">
            <Button onClick={onCapture} size="sm">
              <Camera className="mr-2 h-4 w-4" />
              Capture
            </Button>
            <Button onClick={onStopCamera} size="sm" variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      );
    }
    if (preview) {
      return (
        <div className="relative">
          <Image
            alt="Selfie preview"
            className="h-48 w-full rounded-lg object-cover"
            height={192}
            src={preview}
            width={320}
          />
          <button
            className="absolute top-2 right-2 rounded-full bg-white p-1 shadow-md hover:bg-gray-100"
            onClick={onClear}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      );
    }
    return (
      <button
        className="flex h-48 w-full flex-col items-center justify-center rounded-lg border-2 border-gray-300 border-dashed transition-colors hover:border-red-400 hover:bg-red-50"
        onClick={onStartCamera}
        type="button"
      >
        <Camera className="mb-2 h-8 w-8 text-gray-400" />
        <span className="text-gray-600 text-sm">Take a selfie</span>
        <span className="text-gray-400 text-xs">Click to open camera</span>
      </button>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Camera className="h-5 w-5" />
          Live Selfie
        </CardTitle>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}

// Verify button
function VerifyButton({
  disabled,
  isVerifying,
  modelsLoaded,
  onClick,
}: {
  disabled: boolean;
  isVerifying: boolean;
  modelsLoaded: boolean;
  onClick: () => void;
}) {
  const getButtonContent = () => {
    if (isVerifying) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Verifying...
        </>
      );
    }
    if (modelsLoaded) {
      return (
        <>
          <ShieldCheck className="mr-2 h-4 w-4" />
          Verify Identity
        </>
      );
    }
    return (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </>
    );
  };

  return (
    <Button className="min-w-[200px]" disabled={disabled} onClick={onClick}>
      {getButtonContent()}
    </Button>
  );
}

export default function VerifyPage() {
  const profile = useQuery(api.profiles.getMyProfile);
  const updateVerification = useMutation(api.profiles.updateVerification);

  // Use client-side face verification
  const {
    isLoading: isVerifying,
    modelsLoaded,
    error: verificationError,
    verificationResult,
    verifyImages,
    reset: resetVerification,
  } = useFaceVerification();

  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [state, setState] = useState<VerificationState>("idle");
  const [error, setError] = useState<string | null>(null);

  const idInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Fix: Set video srcObject in useEffect after render
  useEffect(() => {
    if (showCamera && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [showCamera, stream]);

  // Cleanup stream on unmount
  useEffect(
    () => () => {
      if (stream) {
        for (const track of stream.getTracks()) {
          track.stop();
        }
      }
    },
    [stream]
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setIdPhoto(file);
        setIdPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      setStream(mediaStream);
      setShowCamera(true);
    } catch (err) {
      setError(getCameraErrorMessage(err));
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) {
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
        setSelfie(file);
        setSelfiePreview(canvas.toDataURL("image/jpeg"));
      }
    }, "image/jpeg");

    stopCamera();
  };

  const stopCamera = () => {
    if (stream) {
      for (const track of stream.getTracks()) {
        track.stop();
      }
      setStream(null);
    }
    setShowCamera(false);
  };

  const handleVerify = async () => {
    if (!(idPhoto && selfie)) {
      setError("Please upload an ID photo and take a selfie");
      return;
    }

    setState("verifying");
    setError(null);

    try {
      // Use client-side verification - photos processed locally!
      const result = await verifyImages(idPhoto, selfie);

      if (result?.verified) {
        await updateVerification({ verified: true });
        setState("success");
      } else {
        setState("failed");
        const confidence = result?.confidence ?? 0;
        setError(
          `Face match failed. Similarity: ${(confidence * 100).toFixed(1)}% (minimum 40% required)`
        );
      }
    } catch (err) {
      setState("failed");
      setError(
        err instanceof Error
          ? err.message
          : "Verification failed. Please try again."
      );
    }
  };

  const handleReset = () => {
    setIdPhoto(null);
    setSelfie(null);
    setIdPreview(null);
    setSelfiePreview(null);
    setState("idle");
    setError(null);
    resetVerification();
    stopCamera();
  };

  if (profile === undefined) {
    return <LoadingState />;
  }

  if (profile?.verified) {
    return <AlreadyVerifiedState />;
  }

  if (state === "success") {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-2xl px-4">
          <SuccessState confidence={verificationResult?.confidence} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-2xl px-4">
        {/* Back/Skip link at top */}
        <div className="mb-6">
          <Link
            className="inline-flex items-center gap-1 text-gray-600 text-sm hover:text-gray-900"
            href="/browse"
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                d="M15 19l-7-7 7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Browse
          </Link>
        </div>

        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <ShieldCheck className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="font-bold text-3xl text-gray-900">
            Verify Your Identity
          </h1>
          <p className="mx-auto mt-2 max-w-md text-gray-600">
            Help build trust in our community by verifying your identity. This
            is optional but highly recommended.
          </p>
          {!modelsLoaded && (
            <p className="mt-2 text-amber-600 text-sm">
              <Loader2 className="mr-1 inline h-4 w-4 animate-spin" />
              Loading face detection models...
            </p>
          )}
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">How it works</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-gray-600 text-sm">
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100 font-medium text-red-600 text-xs">
                  1
                </span>
                <span>
                  Upload a clear photo of your government ID (passport,
                  driver&apos;s license, or national ID)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100 font-medium text-red-600 text-xs">
                  2
                </span>
                <span>Take a live selfie using your camera</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100 font-medium text-red-600 text-xs">
                  3
                </span>
                <span>
                  We&apos;ll verify that the person in both photos is the same
                </span>
              </li>
            </ol>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <IdPhotoCard
            inputRef={idInputRef}
            onClear={() => {
              setIdPhoto(null);
              setIdPreview(null);
            }}
            onSelect={handleFileSelect}
            preview={idPreview}
          />
          <SelfieCard
            onCapture={capturePhoto}
            onClear={() => {
              setSelfie(null);
              setSelfiePreview(null);
            }}
            onStartCamera={startCamera}
            onStopCamera={stopCamera}
            preview={selfiePreview}
            showCamera={showCamera}
            videoRef={videoRef}
          />
        </div>

        {(error || verificationError) && (
          <div className="mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
            <p className="whitespace-pre-line text-red-700 text-sm">
              {error || verificationError}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex gap-4">
            {state === "failed" && (
              <Button onClick={handleReset} variant="outline">
                Try Again
              </Button>
            )}
            <VerifyButton
              disabled={!(idPhoto && selfie) || isVerifying || !modelsLoaded}
              isVerifying={isVerifying}
              modelsLoaded={modelsLoaded}
              onClick={handleVerify}
            />
          </div>
          <Link href="/browse">
            <Button className="text-gray-500" variant="ghost">
              Skip for now
            </Button>
          </Link>
        </div>

        <p className="mt-6 text-center text-gray-500 text-xs">
          Your photos are processed locally in your browser and are not uploaded
          to any server. We only save whether verification was successful.
        </p>
      </div>
    </div>
  );
}
