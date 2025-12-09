'use client';

import { FormData } from './types';

type SectionType = 'cast' | 'maslak' | 'maritalStatus' | 'motherTongue' | 'belongs' | 'houseType' | 'location';

interface Step17Props {
  formData: FormData;
  validationErrors: Record<string, string>;
  setValidationErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  expandedSections: { maritalStatus: boolean; motherTongue: boolean; belongs: boolean };
  toggleSection: (section: SectionType) => void;
  handleCheckboxChange: (field: SectionType, value: string, checked: boolean) => void;
  customReqMaritalStatus: string;
  setCustomReqMaritalStatus: React.Dispatch<React.SetStateAction<string>>;
  customReqMotherTongue: string;
  setCustomReqMotherTongue: React.Dispatch<React.SetStateAction<string>>;
  customReqBelongs: string;
  setCustomReqBelongs: React.Dispatch<React.SetStateAction<string>>;
}

export default function Step17PartnerStatusLanguage({ 
  formData, 
  validationErrors,
  setValidationErrors,
  expandedSections,
  toggleSection,
  handleCheckboxChange,
  customReqMaritalStatus,
  setCustomReqMaritalStatus,
  customReqMotherTongue,
  setCustomReqMotherTongue,
  customReqBelongs,
  setCustomReqBelongs
}: Step17Props) {
  return (
    <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-200 rounded-xl relative overflow-hidden -mx-5">
      <div className="px-5 py-6">
        <div className="absolute top-0 right-0 w-20 h-20 bg-pink-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-rose-100 rounded-full translate-y-8 -translate-x-8 opacity-50"></div>
        
        <div className="relative z-10 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">💕</span>
            </div>
            <h2 className="text-lg font-bold text-gray-800">Partner Status & Language</h2>
          </div>
          <p className="text-sm text-gray-600 ml-11">Marital status, language and nationality preferences</p>
        </div>
        
        <div className="space-y-4 relative z-10">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Marital Status
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
              💡 Apne ideal partner ki marital status (single, divorced, etc.) select karein. Custom bhi likh sakte hain.
            </div>
            {validationErrors.maritalStatus && (
              <p className="text-red-500 text-xs mb-1">{validationErrors.maritalStatus}</p>
            )}
            
            {/* Clickable Input Display */}
            <div 
              className="mb-2 min-h-[40px] p-3 border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-orange-300 transition-colors"
              onClick={() => toggleSection('maritalStatus')}
            >
              {formData.requirements.maritalStatus.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {formData.requirements.maritalStatus.map(status => (
                    <span key={status} className="inline-flex items-center px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-md">
                      {status}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckboxChange('maritalStatus', status, false);
                        }}
                        className="ml-1 text-orange-600 hover:text-orange-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <span className="text-xs text-gray-500 ml-2 self-center">Click to add more</span>
                </div>
              ) : (
                <span className="text-gray-400 text-sm">Click to select preferred marital status</span>
              )}
            </div>

            {expandedSections.maritalStatus && (
              <div className="space-y-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="grid grid-cols-2 gap-2">
                  {['Single', 'Divorced', 'Widowed', 'Separated'].map(status => (
                    <label key={status} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={formData.requirements.maritalStatus.includes(status)}
                        onChange={(e) => {
                          // Clear error
                          setValidationErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.maritalStatus;
                            return newErrors;
                          });
                          handleCheckboxChange('maritalStatus', status, e.target.checked);
                        }}
                        className="mr-2 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      {status}
                    </label>
                  ))}
                </div>
                <div>
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={formData.requirements.maritalStatus.includes('Any')}
                      onChange={(e) => handleCheckboxChange('maritalStatus', 'Any', e.target.checked)}
                      className="mr-2 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    Any Status
                  </label>
                </div>
                
                {/* Custom Marital Status Input */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 text-sm">Other (Custom)</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter custom status"
                      value={customReqMaritalStatus}
                      onChange={(e) => setCustomReqMaritalStatus(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && customReqMaritalStatus.trim()) {
                          e.preventDefault();
                          handleCheckboxChange('maritalStatus', customReqMaritalStatus.trim(), true);
                          setCustomReqMaritalStatus('');
                        }
                      }}
                      className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400/50 focus:border-orange-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customReqMaritalStatus.trim()) {
                          handleCheckboxChange('maritalStatus', customReqMaritalStatus.trim(), true);
                          setCustomReqMaritalStatus('');
                        }
                      }}
                      className="px-3 py-1.5 text-xs bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Mother Tongue</label>
            <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
              💡 Apne ideal partner ki madri zaban select karein. List mein nahi hai to custom bhi likh sakte hain.
            </div>
            
            {/* Clickable Input Display */}
            <div 
              className="mb-2 min-h-[40px] p-3 border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-green-300 transition-colors"
              onClick={() => toggleSection('motherTongue')}
            >
              {formData.requirements.motherTongue.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {formData.requirements.motherTongue.map(language => (
                    <span key={language} className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded-md">
                      {language}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckboxChange('motherTongue', language, false);
                        }}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <span className="text-xs text-gray-500 ml-2 self-center">Click to add more</span>
                </div>
              ) : (
                <span className="text-gray-400 text-sm">Click to select preferred mother tongue</span>
              )}
            </div>

            {expandedSections.motherTongue && (
              <div className="space-y-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="grid grid-cols-2 gap-2">
                  {['Urdu', 'English', 'Punjabi', 'Sindhi', 'Pashto', 'Balochi', 'Saraiki', 'Hindko', 'Kashmiri', 'Arabic', 'Persian', 'Turkish'].map(language => (
                    <label key={language} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={formData.requirements.motherTongue.includes(language)}
                        onChange={(e) => handleCheckboxChange('motherTongue', language, e.target.checked)}
                        className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      {language}
                    </label>
                  ))}
                </div>
                <div>
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={formData.requirements.motherTongue.includes('Any')}
                      onChange={(e) => handleCheckboxChange('motherTongue', 'Any', e.target.checked)}
                      className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    Any Language
                  </label>
                </div>
                
                {/* Custom Mother Tongue Input */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 text-sm">Other (Custom)</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter custom language"
                      value={customReqMotherTongue}
                      onChange={(e) => setCustomReqMotherTongue(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && customReqMotherTongue.trim()) {
                          e.preventDefault();
                          handleCheckboxChange('motherTongue', customReqMotherTongue.trim(), true);
                          setCustomReqMotherTongue('');
                        }
                      }}
                      className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400/50 focus:border-green-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customReqMotherTongue.trim()) {
                          handleCheckboxChange('motherTongue', customReqMotherTongue.trim(), true);
                          setCustomReqMotherTongue('');
                        }
                      }}
                      className="px-3 py-1.5 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Nationality</label>
            <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
              💡 Apne ideal partner ki nationality/mulk select karein. List mein nahi hai to custom bhi likh sakte hain.
            </div>
            
            {/* Clickable Input Display */}
            <div 
              className="mb-2 min-h-[40px] p-3 border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-teal-300 transition-colors"
              onClick={() => toggleSection('belongs')}
            >
              {formData.requirements.belongs.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {formData.requirements.belongs.map(country => (
                    <span key={country} className="inline-flex items-center px-2 py-1 text-xs bg-teal-100 text-teal-800 rounded-md">
                      {country}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckboxChange('belongs', country, false);
                        }}
                        className="ml-1 text-teal-600 hover:text-teal-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <span className="text-xs text-gray-500 ml-2 self-center">Click to add more</span>
                </div>
              ) : (
                <span className="text-gray-400 text-sm">Click to select preferred nationality</span>
              )}
            </div>

            {expandedSections.belongs && (
              <div className="space-y-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="grid grid-cols-2 gap-2">
                  {['Pakistan', 'Bangladesh', 'India', 'Afghanistan', 'Iran', 'Turkey', 'Saudi Arabia', 'UAE', 'UK', 'USA', 'Canada', 'Australia'].map(country => (
                    <label key={country} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={formData.requirements.belongs.includes(country)}
                        onChange={(e) => handleCheckboxChange('belongs', country, e.target.checked)}
                        className="mr-2 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      {country}
                    </label>
                  ))}
                </div>
                <div>
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={formData.requirements.belongs.includes('Any')}
                      onChange={(e) => handleCheckboxChange('belongs', 'Any', e.target.checked)}
                      className="mr-2 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    Any Nationality
                  </label>
                </div>
                
                {/* Custom Nationality Input */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 text-sm">Other (Custom)</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter custom nationality"
                      value={customReqBelongs}
                      onChange={(e) => setCustomReqBelongs(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && customReqBelongs.trim()) {
                          e.preventDefault();
                          handleCheckboxChange('belongs', customReqBelongs.trim(), true);
                          setCustomReqBelongs('');
                        }
                      }}
                      className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-400/50 focus:border-teal-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customReqBelongs.trim()) {
                          handleCheckboxChange('belongs', customReqBelongs.trim(), true);
                          setCustomReqBelongs('');
                        }
                      }}
                      className="px-3 py-1.5 text-xs bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Partner Requirements Section Footer */}
        <div className="mt-6 pt-4 border-t border-pink-200 relative z-10">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>✨</span>
            <span>These preferences will help us find your perfect match</span>
            <span>✨</span>
          </div>
        </div>
      </div>
    </div>
  );
}
