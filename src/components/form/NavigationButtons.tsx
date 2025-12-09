'use client';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  loading: boolean;
  photoUploading: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
}

export default function NavigationButtons({
  currentStep,
  totalSteps,
  loading,
  photoUploading,
  onPrevStep,
  onNextStep
}: NavigationButtonsProps) {
  return (
    <div className="flex gap-2 pt-4">
      {currentStep > 1 && (
        <button
          type="button"
          onClick={onPrevStep}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition-all shadow-sm active:scale-95 touch-manipulation font-medium"
        >
          ← Previous
        </button>
      )}
      
      {currentStep < totalSteps ? (
        <button
          type="button"
          onClick={onNextStep}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-2 rounded-lg text-sm transition-all shadow-sm active:scale-95 touch-manipulation font-medium"
        >
          Next Step →
        </button>
      ) : (
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 touch-manipulation font-medium"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              {photoUploading ? 'Uploading Photo...' : 'Creating Profile...'}
            </div>
          ) : (
            'Submit Profile 💕'
          )}
        </button>
      )}
    </div>
  );
}
