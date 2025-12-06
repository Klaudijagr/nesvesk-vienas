import { useMutation, useQuery } from 'convex/react';
import {
  AlertCircle,
  Camera,
  CheckCircle,
  CreditCard,
  Loader2,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../convex/_generated/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

type VerificationState = 'idle' | 'uploading' | 'verifying' | 'success' | 'failed';

export function VerifyPage() {
  const profile = useQuery(api.profiles.getMyProfile);
  const updateVerification = useMutation(api.profiles.updateVerification);

  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [state, setState] = useState<VerificationState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [similarity, setSimilarity] = useState<number | null>(null);

  const idInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleFileSelect = useCallback(
    (type: 'id' | 'selfie') => (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'id') {
          setIdPhoto(file);
          setIdPreview(reader.result as string);
        } else {
          setSelfie(file);
          setSelfiePreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    },
    [],
  );

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
      });
      setStream(mediaStream);
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      setError('Could not access camera. Please upload a photo instead.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) {
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
        setSelfie(file);
        setSelfiePreview(canvas.toDataURL('image/jpeg'));
      }
    }, 'image/jpeg');

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
      setError('Please upload both an ID photo and a selfie');
      return;
    }

    setState('uploading');
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image1', idPhoto);
      formData.append('image2', selfie);

      setState('verifying');

      const response = await fetch('/api/face/verify', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || 'Verification failed');
      }

      setSimilarity(result.confidence);

      if (result.verified) {
        await updateVerification({ verified: true });
        setState('success');
      } else {
        setState('failed');
        setError(
          `Face match failed. Similarity: ${(result.confidence * 100).toFixed(1)}% (minimum 40% required)`,
        );
      }
    } catch (err) {
      setState('failed');
      setError(err instanceof Error ? err.message : 'Verification failed. Please try again.');
    }
  };

  const resetVerification = () => {
    setIdPhoto(null);
    setSelfie(null);
    setIdPreview(null);
    setSelfiePreview(null);
    setState('idle');
    setError(null);
    setSimilarity(null);
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
              <h2 className="mb-2 font-bold text-2xl text-gray-900">Already Verified</h2>
              <p className="mb-6 text-gray-600">
                Your identity has been verified. You can now fully participate in the platform.
              </p>
              <Link to="/dashboard">
                <Button>Go to Dashboard</Button>
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
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <ShieldCheck className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="font-bold text-3xl text-gray-900">Verify Your Identity</h1>
          <p className="mx-auto mt-2 max-w-md text-gray-600">
            Help build trust in our community by verifying your identity. This is optional but
            highly recommended.
          </p>
        </div>

        {state === 'success' ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="mb-2 font-bold text-2xl text-green-700">Verification Successful!</h2>
              <p className="mb-2 text-gray-600">
                Your identity has been verified. You now have a verified badge on your profile.
              </p>
              {similarity !== null && (
                <p className="mb-6 text-gray-500 text-sm">
                  Face match confidence: {(similarity * 100).toFixed(1)}%
                </p>
              )}
              <Link to="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Instructions */}
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
                      Upload a clear photo of your government ID (passport, driver's license, or
                      national ID)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100 font-medium text-red-600 text-xs">
                      2
                    </span>
                    <span>Take a selfie or upload a recent photo of yourself</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100 font-medium text-red-600 text-xs">
                      3
                    </span>
                    <span>We'll verify that the person in both photos is the same</span>
                  </li>
                </ol>
              </CardContent>
            </Card>

            {/* Upload Section */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* ID Photo */}
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
                    onChange={handleFileSelect('id')}
                    ref={idInputRef}
                    type="file"
                  />

                  {idPreview ? (
                    <div className="relative">
                      <img
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
                      <span className="text-gray-600 text-sm">Upload ID photo</span>
                      <span className="text-gray-400 text-xs">JPG, PNG up to 10MB</span>
                    </button>
                  )}
                </CardContent>
              </Card>

              {/* Selfie */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Camera className="h-5 w-5" />
                    Selfie
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <input
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect('selfie')}
                    ref={selfieInputRef}
                    type="file"
                  />

                  {showCamera ? (
                    <div className="relative">
                      <video
                        autoPlay
                        className="h-48 w-full rounded-lg object-cover"
                        playsInline
                        ref={videoRef}
                      />
                      <div className="absolute inset-x-0 bottom-2 flex justify-center gap-2">
                        <Button onClick={capturePhoto} size="sm">
                          Capture
                        </Button>
                        <Button onClick={stopCamera} size="sm" variant="outline">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : selfiePreview ? (
                    <div className="relative">
                      <img
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
                    <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-lg border-2 border-gray-300 border-dashed">
                      <div className="flex gap-2">
                        <Button onClick={startCamera} size="sm" variant="outline">
                          <Camera className="mr-2 h-4 w-4" />
                          Take Photo
                        </Button>
                        <Button
                          onClick={() => selfieInputRef.current?.click()}
                          size="sm"
                          variant="outline"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload
                        </Button>
                      </div>
                      <span className="text-gray-400 text-xs">JPG, PNG up to 10MB</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Error Message */}
            {error ? (
              <div className="mt-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            ) : null}

            {/* Action Buttons */}
            <div className="mt-8 flex justify-center gap-4">
              {state === 'failed' && (
                <Button onClick={resetVerification} variant="outline">
                  Try Again
                </Button>
              )}
              <Button
                className="min-w-[200px]"
                disabled={!(idPhoto && selfie) || state === 'uploading' || state === 'verifying'}
                onClick={handleVerify}
              >
                {state === 'uploading' || state === 'verifying' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {state === 'uploading' ? 'Uploading...' : 'Verifying...'}
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Verify Identity
                  </>
                )}
              </Button>
            </div>

            {/* Privacy Note */}
            <p className="mt-6 text-center text-gray-500 text-xs">
              Your photos are processed locally and are not stored. We only save whether
              verification was successful.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
