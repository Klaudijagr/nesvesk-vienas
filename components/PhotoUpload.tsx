"use client";

import { useMutation } from "convex/react";
import { Camera, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import { api } from "@/convex/_generated/api";
import { Button } from "./ui/button";

type PhotoUploadProps = {
  currentPhotoUrl?: string;
  onPhotoUploaded: (url: string) => void;
};

export function PhotoUpload({
  currentPhotoUrl,
  onPhotoUploaded,
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveProfilePhoto = useMutation(api.files.saveProfilePhoto);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setUploading(true);

      const uploadUrl = await generateUploadUrl();

      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } = await response.json();

      const photoUrl = await saveProfilePhoto({ storageId });
      onPhotoUploaded(photoUrl);
      // Keep preview until Convex URL is ready
    } catch {
      setPreviewUrl(null);
    } finally {
      setUploading(false);
      // Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    onPhotoUploaded("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayUrl = previewUrl || currentPhotoUrl;

  return (
    <div className="flex items-center gap-3">
      {displayUrl ? (
        <div className="relative">
          {/* Use native img for data URLs (preview) */}
          <img
            alt="Profile"
            className="h-24 w-24 rounded-xl object-cover"
            height={96}
            src={displayUrl}
            width={96}
          />
          {!uploading && (
            <button
              className="-top-1 -right-1 absolute rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
              onClick={handleRemovePhoto}
              type="button"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50">
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        <button
          className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-gray-300 border-dashed bg-gray-50 transition-colors hover:border-gray-400 hover:bg-gray-100"
          onClick={() => fileInputRef.current?.click()}
          type="button"
        >
          <Camera className="h-6 w-6 text-gray-400" />
          <span className="mt-1 text-gray-500 text-xs">Add photo</span>
        </button>
      )}

      <input
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
        ref={fileInputRef}
        type="file"
      />

      {displayUrl && !uploading && (
        <Button
          onClick={() => fileInputRef.current?.click()}
          size="sm"
          type="button"
          variant="outline"
        >
          <Camera className="mr-2 h-4 w-4" />
          Change
        </Button>
      )}
    </div>
  );
}
