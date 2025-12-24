"use client";

import { useMutation } from "convex/react";
import { Camera, Loader2, X } from "lucide-react";
import posthog from "posthog-js";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { usePhotoUpload } from "@/hooks/use-photo-upload";
import { Button } from "./ui/button";

type PhotoUploadProps = {
  currentPhotoUrl?: string;
  onPhotoUploaded: (url: string) => void;
};

export function PhotoUpload({
  currentPhotoUrl,
  onPhotoUploaded,
}: PhotoUploadProps) {
  const saveProfilePhoto = useMutation(api.files.saveProfilePhoto);

  const {
    isUploading,
    previewUrl,
    fileInputRef,
    handleFileChange,
    triggerFileSelect,
    clearPreview,
  } = usePhotoUpload({
    onSuccess: async (storageId: Id<"_storage">) => {
      const photoUrl = await saveProfilePhoto({ storageId });
      onPhotoUploaded(photoUrl);
      posthog.capture("profile-photo-uploaded", { storageId });
    },
  });

  const handleRemovePhoto = () => {
    posthog.capture("profile-photo-removed");
    clearPreview();
    onPhotoUploaded("");
  };

  const displayUrl = previewUrl || currentPhotoUrl;

  return (
    <div className="flex items-center gap-3">
      {displayUrl ? (
        <div className="relative">
          <img
            alt="Profile"
            className="h-24 w-24 rounded-xl object-cover"
            height={96}
            src={displayUrl}
            width={96}
          />
          {!isUploading && (
            <button
              className="-top-1 -right-1 absolute rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
              onClick={handleRemovePhoto}
              type="button"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50">
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        <button
          className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-gray-300 border-dashed bg-gray-50 transition-colors hover:border-gray-400 hover:bg-gray-100"
          onClick={triggerFileSelect}
          type="button"
        >
          <Camera className="h-6 w-6 text-gray-400" />
          <span className="mt-1 text-gray-500 text-xs">Add photo</span>
        </button>
      )}

      <input
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        ref={fileInputRef}
        type="file"
      />

      {displayUrl && !isUploading && (
        <Button
          onClick={triggerFileSelect}
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
