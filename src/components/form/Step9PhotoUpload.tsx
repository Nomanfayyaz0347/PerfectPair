'use client';

interface Step9Props {
  photoPreview: string | null;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removePhoto: () => void;
}

export default function Step9PhotoUpload({ 
  photoPreview, 
  handlePhotoChange,
  removePhoto
}: Step9Props) {
  return (
    <div>
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">📷 Profile Photo</h2>
          <p className="text-xs text-gray-600 mt-1">Upload a profile photo (optional)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
          <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
            🔒 Yeh photo sirf admin ke paas rahegi - kisi ke saath share nahi hogi. Aapki privacy hamari zimmedari hai.
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
            {photoPreview ? (
              <div className="space-y-2">
                <div className="relative inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    className="w-20 h-20 object-cover rounded-full mx-auto border-2 border-emerald-200"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors text-xs"
                  >
                    ×
                  </button>
                </div>
                <p className="text-xs text-gray-600">Photo selected</p>
                <label className="inline-flex items-center px-3 py-1.5 text-xs bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 cursor-pointer transition-colors font-light">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                  Change
                </label>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-2xl">📸</div>
                <p className="text-xs text-gray-600">Upload photo</p>
                <label className="inline-flex items-center px-4 py-2 text-xs bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg cursor-pointer transition-all touch-manipulation font-light">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                  📷 Choose
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
