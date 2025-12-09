'use client';

import { FormData } from './types';

interface Step14Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  selectClasses: string;
  validationErrors: Record<string, string>;
  setValidationErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  showCustomReqEducation: boolean;
  setShowCustomReqEducation: React.Dispatch<React.SetStateAction<boolean>>;
  customReqEducation: string;
  setCustomReqEducation: React.Dispatch<React.SetStateAction<string>>;
  showCustomReqOccupation: boolean;
  setShowCustomReqOccupation: React.Dispatch<React.SetStateAction<boolean>>;
  customReqOccupation: string;
  setCustomReqOccupation: React.Dispatch<React.SetStateAction<string>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function Step14PartnerEducationCareer({ 
  formData, 
  setFormData,
  selectClasses,
  validationErrors,
  setValidationErrors,
  showCustomReqEducation,
  setShowCustomReqEducation,
  customReqEducation,
  setCustomReqEducation,
  showCustomReqOccupation,
  setShowCustomReqOccupation,
  customReqOccupation,
  setCustomReqOccupation,
  handleInputChange
}: Step14Props) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl relative overflow-hidden -mx-5">
      <div className="px-5 py-6">
        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-indigo-100 rounded-full translate-y-8 -translate-x-8 opacity-50"></div>
        
        <div className="relative z-10 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🎓</span>
            </div>
            <h2 className="text-lg font-bold text-gray-800">Partner Education & Career</h2>
          </div>
          <p className="text-sm text-gray-600 ml-11">Education and career preferences</p>
        </div>
        
        <div className="space-y-4 relative z-10">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <span className="text-blue-500">🎓</span>
              Preferred Education Level
              <span className="text-red-500">*</span>
            </label>
            <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
              💡 Apne ideal partner ki taleem ka level select karein. Agar specific requirement hai to "Other" use karein.
            </div>
            {validationErrors.education && (
              <p className="text-red-500 text-xs mb-1">{validationErrors.education}</p>
            )}
            {showCustomReqEducation ? (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter custom education requirement"
                  value={customReqEducation}
                  onChange={(e) => {
                    // Clear error
                    setValidationErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.education;
                      return newErrors;
                    });
                    
                    setCustomReqEducation(e.target.value);
                    setFormData(prev => ({
                      ...prev,
                      requirements: {
                        ...prev.requirements,
                        education: e.target.value
                      }
                    }));
                  }}
                  className="w-full pr-10 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400/50 focus:border-blue-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomReqEducation(false);
                    setFormData(prev => ({
                      ...prev,
                      requirements: {
                        ...prev.requirements,
                        education: ''
                      }
                    }));
                    setCustomReqEducation('');
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                  title="Back to dropdown"
                >
                  ↩️
                </button>
              </div>
            ) : (
              <select
                name="requirements.education"
                value={formData.requirements.education}
                onChange={(e) => {
                  // Clear error
                  setValidationErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.education;
                    return newErrors;
                  });
                  
                  if (e.target.value === 'Other') {
                    setShowCustomReqEducation(true);
                    setCustomReqEducation('');
                  } else {
                    handleInputChange(e);
                  }
                }}
                className={selectClasses}
              >
                <option value="">Select Minimum Education</option>
                <option value="Any Education">Any Education Level</option>
                
                {/* Minimum Requirements */}
                <optgroup label="Minimum School Level">
                  <option value="Matric or above">Matric (Class 10) or above</option>
                  <option value="Intermediate or above">Intermediate (Class 12) or above</option>
                  <option value="FSc or above">FSc or above</option>
                </optgroup>
                
                <optgroup label="Minimum Graduate Level">
                  <option value="Bachelor or above">Bachelor&apos;s Degree or above</option>
                  <option value="Graduate or above">Graduate or above</option>
                  <option value="Professional Degree">Professional Degree (MBBS/Engineering)</option>
                </optgroup>
                
                <optgroup label="Minimum Master Level">
                  <option value="Master or above">Master&apos;s Degree or above</option>
                  <option value="MBA or above">MBA or above</option>
                  <option value="MS or above">MS/MSc or above</option>
                </optgroup>
                
                <optgroup label="Professional Qualifications">
                  <option value="CA/CMA">CA/CMA Qualified</option>
                  <option value="Medical Professional">Medical Professional</option>
                  <option value="Engineer">Engineer</option>
                  <option value="PhD">PhD or equivalent</option>
                </optgroup>
                
                <optgroup label="Religious Education">
                  <option value="Religious Education">Religious Education (Alim/Hafiz)</option>
                  <option value="Both Religious & Modern">Both Religious & Modern Education</option>
                </optgroup>
                <option value="Other">Other (Type below)</option>
              </select>
            )}
          </div>
          
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <span className="text-green-500">💼</span>
              Partner&apos;s Preferred Work/Job
            </label>
            <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
              💡 Apne ideal partner ke kaam/pesha ki preference select karein. "Other" se apni marzi ka pesha bhi likh sakte hain.
            </div>
            {showCustomReqOccupation ? (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter custom occupation requirement"
                  value={customReqOccupation}
                  onChange={(e) => {
                    setCustomReqOccupation(e.target.value);
                    setFormData(prev => ({
                      ...prev,
                      requirements: {
                        ...prev.requirements,
                        occupation: e.target.value
                      }
                    }));
                  }}
                  className="w-full pr-10 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400/50 focus:border-green-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomReqOccupation(false);
                    setFormData(prev => ({
                      ...prev,
                      requirements: {
                        ...prev.requirements,
                        occupation: ''
                      }
                    }));
                    setCustomReqOccupation('');
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                  title="Back to dropdown"
                >
                  ↩️
                </button>
              </div>
            ) : (
              <select
                name="requirements.occupation"
                value={formData.requirements.occupation}
                onChange={(e) => {
                  if (e.target.value === 'Other') {
                    setShowCustomReqOccupation(true);
                    setCustomReqOccupation('');
                  } else {
                    handleInputChange(e);
                  }
                }}
                className={selectClasses}
              >
                <option value="">Select Preferred Occupation</option>
                <option value="Any">Any Occupation</option>
                
                {/* Professional Jobs */}
                <optgroup label="Professional Jobs">
                  <option value="Doctor">Doctor</option>
                  <option value="Engineer">Engineer</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Lawyer">Lawyer</option>
                  <option value="Banker">Banker</option>
                  <option value="Software Developer">Software Developer</option>
                  <option value="Government Officer">Government Officer</option>
                </optgroup>

                {/* Business */}
                <optgroup label="Business">
                  <option value="Business Owner">Business Owner</option>
                  <option value="Trader">Trader</option>
                  <option value="Self Employed">Self Employed</option>
                </optgroup>

                {/* If looking for female partner */}
                {formData.gender === 'Male' && (
                  <optgroup label="For Female Partner">
                    <option value="Working Woman">Working Woman</option>
                    <option value="Housewife">Housewife</option>
                    <option value="Home Based Work">Home Based Work</option>
                    <option value="Part Time Job">Part Time Job</option>
                  </optgroup>
                )}

                {/* If looking for male partner */}
                {formData.gender === 'Female' && (
                  <optgroup label="For Male Partner">
                    <option value="Good Job">Good Job</option>
                    <option value="Government Job">Government Job</option>
                    <option value="Business">Business</option>
                    <option value="Professional">Professional</option>
                  </optgroup>
                )}
                <option value="Other">Other (Type below)</option>
              </select>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
