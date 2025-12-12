import imageCompression from "browser-image-compression";

export type CompressionResult =
  | { success: true; file: File; originalSize: number; compressedSize: number }
  | { success: false; error: string };

const MAX_SIZE_MB = 1;
const MAX_WIDTH_OR_HEIGHT = 1920;

/**
 * Compress an image file before upload.
 * Resizes to max 1920px and compresses to ~1MB max.
 */
export async function compressImage(file: File): Promise<CompressionResult> {
  // Validate file type
  if (!file.type.startsWith("image/")) {
    return { success: false, error: "Please select an image file" };
  }

  const originalSize = file.size;

  // If already small enough, skip compression
  if (originalSize <= MAX_SIZE_MB * 1024 * 1024) {
    return { success: true, file, originalSize, compressedSize: originalSize };
  }

  try {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: MAX_SIZE_MB,
      maxWidthOrHeight: MAX_WIDTH_OR_HEIGHT,
      useWebWorker: true,
      fileType: "image/jpeg", // Convert to JPEG for better compression
    });

    return {
      success: true,
      file: compressedFile,
      originalSize,
      compressedSize: compressedFile.size,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to compress image";
    return { success: false, error: message };
  }
}

/**
 * Upload a compressed image to Convex storage.
 * Returns the storage ID on success.
 */
export async function uploadCompressedImage(
  file: File,
  generateUploadUrl: () => Promise<string>
): Promise<
  { success: true; storageId: string } | { success: false; error: string }
> {
  const compressionResult = await compressImage(file);
  if (!compressionResult.success) {
    return { success: false, error: compressionResult.error };
  }

  const compressedFile = compressionResult.file;

  try {
    const uploadUrl = await generateUploadUrl();

    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": compressedFile.type },
      body: compressedFile,
    });

    if (!response.ok) {
      return { success: false, error: "Upload failed" };
    }

    const { storageId } = await response.json();
    return { success: true, storageId };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to upload image";
    return { success: false, error: message };
  }
}
