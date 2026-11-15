"use client";

import { useMutation, useQuery } from "convex/react";
import { Camera, Loader2, Star, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { uploadCompressedImage } from "@/lib/image-compression";

const MAX_PHOTOS = 5;

interface PhotoGalleryProps {
  fallbackPhotoUrl?: string;
}

export const PhotoGallery = ({ fallbackPhotoUrl }: PhotoGalleryProps) => {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [previewUrls, setPreviewUrls] = useState<Map<number, string>>(
    new Map()
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  const photoData = useQuery(api.files.getProfilePhotos);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const addProfilePhoto = useMutation(api.files.addProfilePhoto);
  const removeProfilePhoto = useMutation(api.files.removeProfilePhoto);
  const setMainPhoto = useMutation(api.files.setMainPhoto);

  const photos = photoData?.photos ?? [];
  const mainPhoto = photoData?.mainPhoto;

  // Build the display array: photos + empty slots
  const displaySlots = Array.from({ length: MAX_PHOTOS }, (_, i) => {
    const previewUrl = previewUrls.get(i);
    if (previewUrl !== undefined) {
      return { type: "preview" as const, url: previewUrl };
    }
    if (photos[i]) {
      return { type: "photo" as const, url: photos[i] };
    }
    if (
      i === 0 &&
      photos.length === 0 &&
      fallbackPhotoUrl !== undefined &&
      fallbackPhotoUrl !== ""
    ) {
      return { type: "fallback" as const, url: fallbackPhotoUrl };
    }
    return { type: "empty" as const, url: null };
  });

  const handleSlotClick = (index: number) => {
    const slot = displaySlots[index];
    if (slot.type === "empty" || slot.type === "fallback") {
      setActiveSlot(index);
      fileInputRef.current?.click();
    }
  };

  const clearSlotPreview = useCallback((slot: number) => {
    setPreviewUrls((prev) => {
      const next = new Map(prev);
      next.delete(slot);
      return next;
    });
  }, []);

  const uploadPhoto = async (file: File, currentSlot: number) => {
    try {
      const uploadResult = await uploadCompressedImage(file, generateUploadUrl);
      if (!uploadResult.success) {
        toast.error(uploadResult.error);
        clearSlotPreview(currentSlot);
        return;
      }

      await addProfilePhoto({
        storageId: uploadResult.storageId,
        setAsMain: photos.length === 0,
      });
      clearSlotPreview(currentSlot);
      toast.success("Photo uploaded");
    } catch (error) {
      clearSlotPreview(currentSlot);
      const message =
        error instanceof Error ? error.message : "Failed to save photo";
      toast.error(message);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || activeSlot === null) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const currentSlot = activeSlot;

    // Show preview immediately
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const { result } = reader;
      if (typeof result !== "string") {
        return;
      }
      setPreviewUrls((prev) => new Map([...prev, [currentSlot, result]]));
    });
    reader.readAsDataURL(file);

    setUploadingIndex(currentSlot);

    // uploadPhoto reports its own failures, so the cleanup below always runs.
    await uploadPhoto(file, currentSlot);

    setUploadingIndex(null);
    setActiveSlot(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = async (photoUrl: string) => {
    try {
      await removeProfilePhoto({ photoUrl });
      toast.success("Photo removed");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to remove photo";
      toast.error(message);
    }
  };

  const handleSetMain = async (photoUrl: string) => {
    if (photoUrl === mainPhoto) {
      return;
    }
    try {
      await setMainPhoto({ photoUrl });
      toast.success("Main photo updated");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to set main photo";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Photos</span>
        <span className="text-muted-foreground text-sm">
          ({photos.length}/{MAX_PHOTOS})
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {displaySlots.map((slot, index) => (
          <div
            className="group relative aspect-square"
            key={`slot-${index}-${slot.url ?? "empty"}`}
          >
            {slot.type === "empty" ? (
              <button
                className="border-border bg-muted/50 hover:border-muted-foreground/40 hover:bg-muted flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors"
                onClick={() => {
                  handleSlotClick(index);
                }}
                type="button"
              >
                <Camera className="text-muted-foreground/70 h-5 w-5" />
                <span className="text-muted-foreground mt-1 text-xs">
                  {index === 0 ? "Main" : "Add"}
                </span>
              </button>
            ) : (
              <div className="relative h-full w-full">
                {/* The local preview is a data: URL, which the image optimizer cannot fetch. */}
                <Image
                  alt={`Gallery item ${index + 1}`}
                  className="h-full w-full rounded-lg object-cover"
                  height={128}
                  src={slot.url ?? ""}
                  unoptimized={slot.type === "preview"}
                  width={128}
                />

                {slot.type === "photo" && slot.url === mainPhoto && (
                  <div className="bg-gold-rich absolute top-1 left-1 rounded px-1.5 py-0.5 text-xs font-medium text-white shadow-sm">
                    Main
                  </div>
                )}

                {uploadingIndex === index && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  </div>
                )}

                {slot.type === "photo" && uploadingIndex !== index && (
                  <div className="absolute inset-0 flex items-center justify-center gap-1 rounded-lg bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                    {slot.url !== mainPhoto && slot.url && (
                      <button
                        className="text-gold-strong rounded-full bg-white/90 p-1.5 shadow-sm transition-colors hover:bg-white"
                        onClick={() => {
                          void handleSetMain(slot.url);
                        }}
                        title="Set as main photo"
                        type="button"
                      >
                        <Star className="h-4 w-4" />
                      </button>
                    )}
                    {slot.url && (
                      <button
                        className="text-destructive rounded-full bg-white/90 p-1.5 shadow-sm transition-colors hover:bg-white"
                        onClick={() => {
                          void handleRemovePhoto(slot.url);
                        }}
                        title="Remove photo"
                        type="button"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}

                {slot.type === "fallback" && (
                  <button
                    className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-black/0 opacity-0 transition-all hover:bg-black/40 hover:opacity-100"
                    onClick={() => {
                      handleSlotClick(index);
                    }}
                    type="button"
                  >
                    <div className="flex flex-col items-center text-white">
                      <Camera className="h-5 w-5" />
                      <span className="mt-1 text-xs">Change</span>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <input
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          void handleFileSelect(event);
        }}
        ref={fileInputRef}
        type="file"
      />
    </div>
  );
};
