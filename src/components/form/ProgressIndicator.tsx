'use client';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const getStepLabel = () => {
    if (currentStep <= 2) return '📝 Submission & Basic Info';
    if (currentStep >= 3 && currentStep <= 5) return '👤 Personal Details';
    if (currentStep >= 6 && currentStep <= 8) return '🎓 Education & Photo';
    if (currentStep >= 9 && currentStep <= 10) return '🏠 Family & Contact';
    if (currentStep >= 11 && currentStep <= 12) return '📍 Location & Address';
    return '💕 Partner Requirements';
  };

  return (
    <div className="mb-6 bg-white border border-teal-100 rounded-2xl shadow-sm p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-800">Step {currentStep} of {totalSteps}</span>
        <span className="text-sm font-bold text-teal-600">{Math.round((currentStep / totalSteps) * 100)}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
        <div 
          className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      <div className="text-center text-xs text-gray-600">
        {getStepLabel()}
      </div>
    </div>
  );
}
