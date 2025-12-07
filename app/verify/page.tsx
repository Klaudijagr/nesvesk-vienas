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
    } catch {
      setError("Could not access camera. Please check permissions.");
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
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (profile?.verified) {
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
                Your identity has been verified. You can now fully participate
                in the platform.
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-2xl px-4">
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

        {state === "success" ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="mb-2 font-bold text-2xl text-green-700">
                Verification Successful!
              </h2>
              <p className="mb-2 text-gray-600">
                Your identity has been verified. You now have a verified badge
                on your profile.
              </p>
              {verificationResult && (
                <p className="mb-6 text-gray-500 text-sm">
                  Face match confidence:{" "}
                  {(verificationResult.confidence * 100).toFixed(1)}%
                </p>
              )}
              <Link href="/browse">
                <Button>Go to Browse</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
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
                      We&apos;ll verify that the person in both photos is the
                      same
                    </span>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              {/* ID Photo - Upload only */}
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
                    onChange={handleFileSelect}
                    ref={idInputRef}
                    type="file"
                  />

                  {idPreview ? (
                    <div className="relative">
                      <Image
                        alt="ID preview"
                        className="h-48 w-full rounded-lg object-cover"
                        height={192}
                        src={idPreview}
                        width={320}
                      />
                      <button
                        className="absolute top-2 right-2 rounded-full bg-white p-1 shadow-md hover:bg-gray-100"
                        onClick={() => {
                          setIdPhoto(null);
                          setIdPreview(null);
                        }}
                        type="button"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="flex h-48 w-full flex-col items-center justify-center rounded-lg border-2 border-gray-300 border-dashed transition-colors hover:border-red-400 hover:bg-red-50"
                      onClick={() => idInputRef.current?.click()}
                      type="button"
                    >
                      <Upload className="mb-2 h-8 w-8 text-gray-400" />
                      <span className="text-gray-600 text-sm">
                        Upload ID photo
                      </span>
                      <span className="text-gray-400 text-xs">
                        JPG, PNG up to 10MB
                      </span>
                    </button>
                  )}
                </CardContent>
              </Card>

              {/* Selfie - Camera only, no upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Camera className="h-5 w-5" />
                    Live Selfie
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {showCamera ? (
                    <div className="relative">
                      {/* biome-ignore lint/a11y/useMediaCaption: Live camera feed, no captions needed */}
                      <video
                        autoPlay
                        className="h-48 w-full rounded-lg object-cover"
                        muted
                        playsInline
                        ref={videoRef}
                      />
                      <div className="absolute inset-x-0 bottom-2 flex justify-center gap-2">
                        <Button onClick={capturePhoto} size="sm">
                          <Camera className="mr-2 h-4 w-4" />
                          Capture
                        </Button>
                        <Button
                          onClick={stopCamera}
                          size="sm"
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : selfiePreview ? (
                    <div className="relative">
                      <Image
                        alt="Selfie preview"
                        className="h-48 w-full rounded-lg object-cover"
                        height={192}
                        src={selfiePreview}
                        width={320}
                      />
                      <button
                        className="absolute top-2 right-2 rounded-full bg-white p-1 shadow-md hover:bg-gray-100"
                        onClick={() => {
                          setSelfie(null);
                          setSelfiePreview(null);
                        }}
                        type="button"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="flex h-48 w-full flex-col items-center justify-center rounded-lg border-2 border-gray-300 border-dashed transition-colors hover:border-red-400 hover:bg-red-50"
                      onClick={startCamera}
                      type="button"
                    >
                      <Camera className="mb-2 h-8 w-8 text-gray-400" />
                      <span className="text-gray-600 text-sm">
                        Take a selfie
                      </span>
                      <span className="text-gray-400 text-xs">
                        Click to open camera
                      </span>
                    </button>
                  )}
                </CardContent>
              </Card>
            </div>

            {(error || verificationError) && (
              <div className="mt-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                <p className="text-red-700 text-sm">
                  {error || verificationError}
                </p>
              </div>
            )}

            <div className="mt-8 flex justify-center gap-4">
              {state === "failed" && (
                <Button onClick={handleReset} variant="outline">
                  Try Again
                </Button>
              )}
              <Button
                className="min-w-[200px]"
                disabled={!(idPhoto && selfie) || isVerifying || !modelsLoaded}
                onClick={handleVerify}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : modelsLoaded ? (
                  <>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Verify Identity
                  </>
                ) : (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                )}
              </Button>
            </div>

            <p className="mt-6 text-center text-gray-500 text-xs">
              Your photos are processed locally in your browser and are not
              uploaded to any server. We only save whether verification was
              successful.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
