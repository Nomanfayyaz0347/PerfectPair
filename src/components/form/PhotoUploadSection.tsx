'use client';

interface PhotoUploadSectionProps {
  photoPreview: string | null;
  photoUploading: boolean;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: () => void;
}

export default function PhotoUploadSection({
  photoPreview,
  photoUploading,
  onPhotoChange,
  onRemovePhoto,
}: PhotoUploadSectionProps) {
  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-gray-700">Profile Photo</label>
      
      {photoPreview ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoPreview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border-2 border-emerald-300 mx-auto"
          />
          <button
            type="button"
            onClick={onRemovePhoto}
            className="absolute top-0 right-1/2 transform translate-x-16 -translate-y-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <label className="cursor-pointer">
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-emerald-400 transition-colors">
              {photoUploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              ) : (
                <>
                  <span className="text-3xl text-gray-400">📷</span>
                  <span className="text-xs text-gray-500 mt-1">Upload Photo</span>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={onPhotoChange}
              className="hidden"
              disabled={photoUploading}
            />
          </label>
        </div>
      )}
      <p className="text-xs text-gray-500 text-center">Max size: 5MB (JPEG, PNG)</p>
    </div>
  );
}
