'use client';

import { Profile } from './types';

interface EditProfileModalProps {
  isOpen: boolean;
  editData: Profile;
  editingProfile: Profile | null;
  saving: boolean;
  message: { type: 'success' | 'error'; text: string } | null;
  onClose: () => void;
  onSave: () => void;
  onDelete: (profile: Profile) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onImageClick: (imageUrl: string, imageName: string) => void;
  children: React.ReactNode; // EditProfileFormAdmin component
}

export default function EditProfileModal({
  isOpen,
  editData,
  editingProfile,
  saving,
  message,
  onClose,
  onSave,
  onDelete,
  children,
}: EditProfileModalProps) {
  if (!isOpen || !editData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-0">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        
        {/* Modal Header - Mobile First */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100 p-3 sm:p-6 sticky top-0 z-10">
          {/* Mobile Header Layout */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white text-sm sm:text-lg">💕</span>
              </div>
              <div>
                <h1 className="text-sm sm:text-xl text-gray-900 tracking-wide heading font-semibold">
                  Edit Profile
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 font-light hidden sm:block">
                  Update {editData.name}&apos;s information
                </p>
              </div>
            </div>
            
            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="sm:hidden w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <span className="text-lg">✕</span>
            </button>
          </div>
          
          {/* Mobile Profile Name */}
          <div className="sm:hidden mb-3">
            <p className="text-xs text-gray-600">
              Editing: <span className="font-medium text-gray-800">{editData.name}</span>
            </p>
          </div>
          
          {/* Action Buttons - Mobile: Bottom Fixed, Desktop: Inline */}
          <div className="hidden sm:flex justify-between items-center">
            <button
              onClick={() => editingProfile && onDelete(editingProfile)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-2 py-1.5 rounded-md transition-all font-light shadow-sm hover:shadow-md text-xs"
            >
              🗑️ Delete
            </button>
            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-3 py-1.5 rounded-md transition-all font-light shadow-sm hover:shadow-md disabled:opacity-50 text-xs"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
          
          {message && (
            <div className={`mt-3 sm:mt-4 p-3 rounded-lg text-xs sm:text-sm ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}
        </div>

        {/* Modal Body - Mobile Optimized Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-y-contain webkit-overflow-scrolling-touch modal-scroll p-3 sm:p-6 pb-4 sm:pb-6">
          {children}
        </div>
        
        {/* Mobile Bottom Action Buttons */}
        <div className="sm:hidden flex-shrink-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-3 safe-area-inset-bottom">
          <div className="flex flex-col space-y-2">
            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-md transition-colors text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-2 px-3 rounded-md transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-50 text-xs"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => editingProfile && onDelete(editingProfile)}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-3 rounded-md transition-all font-medium shadow-sm hover:shadow-md text-xs"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
