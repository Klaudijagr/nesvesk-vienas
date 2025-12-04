import { useMutation } from 'convex/react';
import { Camera, Loader2, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { api } from '../../convex/_generated/api';
import { Button } from './ui/button';

interface PhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoUploaded: (url: string) => void;
}

export function PhotoUpload({ currentPhotoUrl, onPhotoUploaded }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveProfilePhoto = useMutation(api.files.saveProfilePhoto);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Convex
    try {
      setUploading(true);

      // Get upload URL
      const uploadUrl = await generateUploadUrl();

      // Upload the file
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { storageId } = await response.json();

      // Save to profile and get URL
      const photoUrl = await saveProfilePhoto({ storageId });
      onPhotoUploaded(photoUrl);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload photo. Please try again.');
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    onPhotoUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayUrl = previewUrl || currentPhotoUrl;

  return (
    <div className="space-y-4">
      {displayUrl ? (
        <div className="relative inline-block">
          <img alt="Profile" className="h-32 w-32 rounded-xl object-cover" src={displayUrl} />
          {!uploading && (
            <button
              className="-top-2 -right-2 absolute rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
              onClick={handleRemovePhoto}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        <button
          className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-xl bg-gray-100 transition-colors hover:bg-gray-200"
          onClick={() => fileInputRef.current?.click()}
          type="button"
        >
          <Camera className="h-8 w-8 text-gray-400" />
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
          Change Photo
        </Button>
      )}
    </div>
  );
}
