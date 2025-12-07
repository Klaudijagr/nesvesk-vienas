"use client";

import { useMutation, useQuery } from "convex/react";
import { Camera, Loader2, Star, X } from "lucide-react";
import { useRef, useState } from "react";
import { api } from "@/convex/_generated/api";

const MAX_PHOTOS = 5;

type PhotoGalleryProps = {
  fallbackPhotoUrl?: string;
};

export function PhotoGallery({ fallbackPhotoUrl }: PhotoGalleryProps) {
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
    if (previewUrl) {
      return { type: "preview" as const, url: previewUrl };
    }
    if (photos[i]) {
      return { type: "photo" as const, url: photos[i] };
    }
    // First slot shows fallback if no photos
    if (i === 0 && photos.length === 0 && fallbackPhotoUrl) {
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || activeSlot === null) {
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
      setPreviewUrls((prev) => {
        const next = new Map(prev);
        next.set(activeSlot, event.target?.result as string);
        return next;
      });
    };
    reader.readAsDataURL(file);

    try {
      setUploadingIndex(activeSlot);

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

      // First photo becomes main automatically
      await addProfilePhoto({
        storageId,
        setAsMain: photos.length === 0,
      });

      // Clear preview once uploaded
      setPreviewUrls((prev) => {
        const next = new Map(prev);
        next.delete(activeSlot);
        return next;
      });
    } catch {
      // Clear preview on error
      setPreviewUrls((prev) => {
        const next = new Map(prev);
        next.delete(activeSlot);
        return next;
      });
    } finally {
      setUploadingIndex(null);
      setActiveSlot(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemovePhoto = async (photoUrl: string) => {
    try {
      await removeProfilePhoto({ photoUrl });
    } catch {
      // Handle error silently
    }
  };

  const handleSetMain = async (photoUrl: string) => {
    if (photoUrl === mainPhoto) {
      return;
    }
    try {
      await setMainPhoto({ photoUrl });
    } catch {
      // Handle error silently
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="font-medium text-sm">Photos</span>
        <span className="text-muted-foreground text-sm">
          ({photos.length}/{MAX_PHOTOS})
        </span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {displaySlots.map((slot, index) => (
          <div
            className="group relative aspect-square"
            key={`slot-${index}-${slot.url || "empty"}`}
          >
            {slot.type === "empty" ? (
              <button
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-gray-300 border-dashed bg-gray-50 transition-colors hover:border-gray-400 hover:bg-gray-100"
                onClick={() => handleSlotClick(index)}
                type="button"
              >
                <Camera className="h-5 w-5 text-gray-400" />
                <span className="mt-1 text-gray-500 text-xs">
                  {index === 0 ? "Main" : "Add"}
                </span>
              </button>
            ) : (
              <div className="relative h-full w-full">
                <img
                  alt={`Gallery item ${index + 1}`}
                  className="h-full w-full rounded-lg object-cover"
                  height={128}
                  src={slot.url ?? ""}
                  width={128}
                />

                {/* Main photo badge */}
                {slot.type === "photo" && slot.url === mainPhoto && (
                  <div className="absolute top-1 left-1 rounded bg-amber-500 px-1.5 py-0.5 font-medium text-white text-xs shadow-sm">
                    Main
                  </div>
                )}

                {/* Uploading overlay */}
                {uploadingIndex === index && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  </div>
                )}

                {/* Hover overlay with actions */}
                {slot.type === "photo" && uploadingIndex !== index && (
                  <div className="absolute inset-0 flex items-center justify-center gap-1 rounded-lg bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                    {/* Set as main button */}
                    {slot.url !== mainPhoto && (
                      <button
                        className="rounded-full bg-white/90 p-1.5 text-amber-600 shadow-sm transition-colors hover:bg-white"
                        onClick={() => handleSetMain(slot.url!)}
                        title="Set as main photo"
                        type="button"
                      >
                        <Star className="h-4 w-4" />
                      </button>
                    )}
                    {/* Delete button */}
                    <button
                      className="rounded-full bg-white/90 p-1.5 text-red-600 shadow-sm transition-colors hover:bg-white"
                      onClick={() => handleRemovePhoto(slot.url!)}
                      title="Remove photo"
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Fallback photo overlay - allow clicking to replace */}
                {slot.type === "fallback" && (
                  <button
                    className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-black/0 opacity-0 transition-all hover:bg-black/40 hover:opacity-100"
                    onClick={() => handleSlotClick(index)}
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
        onChange={handleFileSelect}
        ref={fileInputRef}
        type="file"
      />
    </div>
  );
}
