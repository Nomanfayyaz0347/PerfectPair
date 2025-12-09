'use client';

import { FormData } from './types';

interface Step13Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  selectClasses: string;
  validationErrors: Record<string, string>;
  setValidationErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  showCustomReqAgeRange: boolean;
  setShowCustomReqAgeRange: React.Dispatch<React.SetStateAction<boolean>>;
  customReqAgeMin: string;
  setCustomReqAgeMin: React.Dispatch<React.SetStateAction<string>>;
  customReqAgeMax: string;
  setCustomReqAgeMax: React.Dispatch<React.SetStateAction<string>>;
  showCustomReqHeightRange: boolean;
  setShowCustomReqHeightRange: React.Dispatch<React.SetStateAction<boolean>>;
  customReqHeightMin: string;
  setCustomReqHeightMin: React.Dispatch<React.SetStateAction<string>>;
  customReqHeightMax: string;
  setCustomReqHeightMax: React.Dispatch<React.SetStateAction<string>>;
}

export default function Step13PartnerAgeHeight({ 
  formData, 
  setFormData,
  selectClasses,
  validationErrors,
  setValidationErrors,
  showCustomReqAgeRange,
  setShowCustomReqAgeRange,
  customReqAgeMin,
  setCustomReqAgeMin,
  customReqAgeMax,
  setCustomReqAgeMax,
  showCustomReqHeightRange,
  setShowCustomReqHeightRange,
  customReqHeightMin,
  setCustomReqHeightMin,
  customReqHeightMax,
  setCustomReqHeightMax
}: Step13Props) {
  return (
    <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-xl relative overflow-hidden -mx-5">
      <div className="px-5 py-6">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-pink-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-100 rounded-full translate-y-8 -translate-x-8 opacity-50"></div>
        
        {/* Header */}
        <div className="relative z-10 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">💕</span>
            </div>
            <h2 className="text-lg font-bold text-gray-800">Partner Requirements</h2>
          </div>
          <p className="text-sm text-gray-600 ml-11">Tell us about your ideal life partner preferences</p>
        </div>
        
        <div className="space-y-4 relative z-10">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <span className="text-pink-500">🎂</span>
              Preferred Age Range
              <span className="text-red-500">*</span>
            </label>
            <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
              💡 Apne ideal partner ki umar ki range select karein. Agar specific range chahiye to "Custom Range" use karein.
            </div>
            {validationErrors.ageRange && (
              <p className="text-red-500 text-xs mb-1">{validationErrors.ageRange}</p>
            )}
            {!showCustomReqAgeRange ? (
              <div className="flex gap-2">
                <select
                  name="requirements.ageRange"
                  value={`${formData.requirements.ageRange.min}-${formData.requirements.ageRange.max}`}
                  onChange={(e) => {
                    // Clear error
                    setValidationErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.ageRange;
                      return newErrors;
                    });
                    
                    if (e.target.value === 'custom') {
                      setShowCustomReqAgeRange(true);
                      setCustomReqAgeMin(formData.requirements.ageRange.min.toString());
                      setCustomReqAgeMax(formData.requirements.ageRange.max.toString());
                    } else {
                      const [min, max] = e.target.value.split('-').map(Number);
                      setFormData(prev => ({
                        ...prev,
                        requirements: {
                          ...prev.requirements,
                          ageRange: { min, max }
                        }
                      }));
                    }
                  }}
                  className={selectClasses}
                >
                  <option value="18-25">18 - 25 years</option>
                  <option value="20-25">20 - 25 years</option>
                  <option value="22-28">22 - 28 years</option>
                  <option value="25-30">25 - 30 years</option>
                  <option value="26-32">26 - 32 years</option>
                  <option value="28-35">28 - 35 years</option>
                  <option value="30-35">30 - 35 years</option>
                  <option value="30-40">30 - 40 years</option>
                  <option value="32-38">32 - 38 years</option>
                  <option value="35-40">35 - 40 years</option>
                  <option value="35-45">35 - 45 years</option>
                  <option value="40-45">40 - 45 years</option>
                  <option value="40-50">40 - 50 years</option>
                  <option value="45-50">45 - 50 years</option>
                  <option value="45-55">45 - 55 years</option>
                  <option value="50-60">50 - 60 years</option>
                  <option value="18-60">Any Age (18-60)</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Min age"
                    value={customReqAgeMin}
                    onChange={(e) => {
                      setValidationErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.ageRange;
                        return newErrors;
                      });
                      
                      setCustomReqAgeMin(e.target.value);
                      if (e.target.value && customReqAgeMax) {
                        setFormData(prev => ({
                          ...prev,
                          requirements: {
                            ...prev.requirements,
                            ageRange: { min: parseInt(e.target.value), max: parseInt(customReqAgeMax) }
                          }
                        }));
                      }
                    }}
                    className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-400/50 focus:border-pink-400"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    placeholder="Max age"
                    value={customReqAgeMax}
                    onChange={(e) => {
                      setValidationErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.ageRange;
                        return newErrors;
                      });
                      
                      setCustomReqAgeMax(e.target.value);
                      if (customReqAgeMin && e.target.value) {
                        setFormData(prev => ({
                          ...prev,
                          requirements: {
                            ...prev.requirements,
                            ageRange: { min: parseInt(customReqAgeMin), max: parseInt(e.target.value) }
                          }
                        }));
                      }
                    }}
                    className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-400/50 focus:border-pink-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCustomReqAgeRange(false)}
                    className="px-3 py-2 text-xs bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    title="Back to dropdown"
                  >
                    ↩️
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <span className="text-pink-500">📏</span>
              Preferred Height Range
            </label>
            <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
              💡 Apne ideal partner ki height ki range select karein. "Custom Range" se apni marzi ki range bhi de sakte hain.
            </div>
            {!showCustomReqHeightRange ? (
              <select
                name="requirements.heightRange"
                value={`${formData.requirements.heightRange.min}-${formData.requirements.heightRange.max}`}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setShowCustomReqHeightRange(true);
                    setCustomReqHeightMin(formData.requirements.heightRange.min);
                    setCustomReqHeightMax(formData.requirements.heightRange.max);
                  } else {
                    const [min, max] = e.target.value.split('-');
                    setFormData(prev => ({
                      ...prev,
                      requirements: {
                        ...prev.requirements,
                        heightRange: { min, max }
                      }
                    }));
                  }
                }}
                className={selectClasses}
              >
                <option value="4.5-5.2">4.5 - 5.2 feet (Short)</option>
                <option value="4.8-5.4">4.8 - 5.4 feet</option>
                <option value="5.0-5.6">5.0 - 5.6 feet (Average)</option>
                <option value="5.2-5.8">5.2 - 5.8 feet</option>
                <option value="5.4-6.0">5.4 - 6.0 feet (Tall)</option>
                <option value="5.6-6.2">5.6 - 6.2 feet</option>
                <option value="5.8-6.4">5.8 - 6.4 feet (Very Tall)</option>
                <option value="4.0-5.0">4.0 - 5.0 feet</option>
                <option value="5.0-5.5">5.0 - 5.5 feet</option>
                <option value="5.5-6.0">5.5 - 6.0 feet</option>
                <option value="6.0-6.5">6.0 - 6.5 feet</option>
                <option value="4.5-6.5">Any Height (4.5-6.5 feet)</option>
                <option value="custom">Custom Range</option>
              </select>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Min (e.g., 5.0)"
                    value={customReqHeightMin}
                    onChange={(e) => {
                      setCustomReqHeightMin(e.target.value);
                      if (e.target.value && customReqHeightMax) {
                        setFormData(prev => ({
                          ...prev,
                          requirements: {
                            ...prev.requirements,
                            heightRange: { min: e.target.value, max: customReqHeightMax }
                          }
                        }));
                      }
                    }}
                    className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-400/50 focus:border-pink-400"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="text"
                    placeholder="Max (e.g., 6.0)"
                    value={customReqHeightMax}
                    onChange={(e) => {
                      setCustomReqHeightMax(e.target.value);
                      if (customReqHeightMin && e.target.value) {
                        setFormData(prev => ({
                          ...prev,
                          requirements: {
                            ...prev.requirements,
                            heightRange: { min: customReqHeightMin, max: e.target.value }
                          }
                        }));
                      }
                    }}
                    className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-400/50 focus:border-pink-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCustomReqHeightRange(false)}
                    className="px-3 py-2 text-xs bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    title="Back to dropdown"
                  >
                    ↩️
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
