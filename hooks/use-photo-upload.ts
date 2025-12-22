"use client";

import { useMutation } from "convex/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { uploadCompressedImage } from "@/lib/image-compression";

type UploadResult =
  | { success: true; storageId: Id<"_storage"> }
  | { success: false; error: string };

type UsePhotoUploadOptions = {
  onSuccess?: (storageId: Id<"_storage">) => Promise<void> | void;
  onError?: (error: string) => void;
  showToasts?: boolean;
};

export function usePhotoUpload(options: UsePhotoUploadOptions = {}) {
  const { onSuccess, onError, showToasts = true } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const clearPreview = useCallback(() => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const resetInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const upload = useCallback(
    async (file: File): Promise<UploadResult> => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        const error = "Please select an image file";
        if (showToasts) {
          toast.error(error);
        }
        onError?.(error);
        return { success: false, error };
      }

      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      setIsUploading(true);

      const uploadResult = await uploadCompressedImage(file, generateUploadUrl);

      if (!uploadResult.success) {
        setPreviewUrl(null);
        setIsUploading(false);
        resetInput();
        if (showToasts) {
          toast.error(uploadResult.error);
        }
        onError?.(uploadResult.error);
        return { success: false, error: uploadResult.error };
      }

      try {
        const storageId = uploadResult.storageId as Id<"_storage">;
        await onSuccess?.(storageId);
        if (showToasts) {
          toast.success("Photo uploaded");
        }
        return { success: true, storageId };
      } catch (err) {
        setPreviewUrl(null);
        const message =
          err instanceof Error ? err.message : "Failed to save photo";
        if (showToasts) {
          toast.error(message);
        }
        onError?.(message);
        return { success: false, error: message };
      } finally {
        setIsUploading(false);
        resetInput();
      }
    },
    [generateUploadUrl, onSuccess, onError, showToasts, resetInput]
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
        return null;
      }
      return upload(file);
    },
    [upload]
  );

  const triggerFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    // State
    isUploading,
    previewUrl,
    fileInputRef,
    // Actions
    upload,
    handleFileChange,
    triggerFileSelect,
    clearPreview,
    setPreviewUrl,
  };
}
