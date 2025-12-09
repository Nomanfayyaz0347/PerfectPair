'use client';

import { FormData } from './types';

type SectionType = 'cast' | 'maslak' | 'maritalStatus' | 'motherTongue' | 'belongs' | 'houseType' | 'location';

interface Step15Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  selectClasses: string;
  inputClasses: string;
  showCustomReqFamilyType: boolean;
  setShowCustomReqFamilyType: React.Dispatch<React.SetStateAction<boolean>>;
  customReqFamilyType: string;
  setCustomReqFamilyType: React.Dispatch<React.SetStateAction<string>>;
  customReqLocation: string;
  setCustomReqLocation: React.Dispatch<React.SetStateAction<string>>;
  expandedSections: { location: boolean };
  toggleSection: (section: SectionType) => void;
  handleCheckboxChange: (field: SectionType, value: string, checked: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function Step15PartnerFamilyLiving({ 
  formData, 
  setFormData,
  selectClasses,
  inputClasses,
  showCustomReqFamilyType,
  setShowCustomReqFamilyType,
  customReqFamilyType,
  setCustomReqFamilyType,
  customReqLocation,
  setCustomReqLocation,
  expandedSections,
  toggleSection,
  handleCheckboxChange,
  handleInputChange
}: Step15Props) {
  return (
    <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl relative overflow-hidden -mx-5">
      <div className="px-5 py-6">
        <div className="absolute top-0 right-0 w-20 h-20 bg-orange-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-amber-100 rounded-full translate-y-8 -translate-x-8 opacity-50"></div>
        
        <div className="relative z-10 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🏠</span>
            </div>
            <h2 className="text-lg font-bold text-gray-800">Partner Family & Living</h2>
          </div>
          <p className="text-sm text-gray-600 ml-11">Family type, house and location preferences</p>
        </div>
        
        <div className="space-y-4 relative z-10">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <span className="text-orange-500">🏠</span>
              Preferred Family Type
            </label>
            <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
              💡 Joint ya nuclear family ki preference select karein. "Other" se apni marzi ka type bhi likh sakte hain.
            </div>
            {showCustomReqFamilyType ? (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter custom family type"
                  value={customReqFamilyType}
                  onChange={(e) => {
                    setCustomReqFamilyType(e.target.value);
                    setFormData(prev => ({
                      ...prev,
                      requirements: {
                        ...prev.requirements,
                        familyType: e.target.value
                      }
                    }));
                  }}
                  className="w-full pr-10 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400/50 focus:border-orange-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomReqFamilyType(false);
                    setFormData(prev => ({
                      ...prev,
                      requirements: {
                        ...prev.requirements,
                        familyType: ''
                      }
                    }));
                    setCustomReqFamilyType('');
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                  title="Back to dropdown"
                >
                  ↩️
                </button>
              </div>
            ) : (
              <select
                name="requirements.familyType"
                value={formData.requirements.familyType}
                onChange={(e) => {
                  if (e.target.value === 'Other') {
                    setShowCustomReqFamilyType(true);
                    setCustomReqFamilyType('');
                  } else {
                    handleInputChange(e);
                  }
                }}
                className={selectClasses}
              >
                <option value="">Select family type</option>
                <option value="Joint">Joint Family</option>
                <option value="Nuclear">Nuclear Family</option>
                <option value="Any">Any</option>
                <option value="Other">Other (Type below)</option>
              </select>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Location</label>
            <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
              💡 Apne ideal partner ke rehnay ki jagah (city/country) select karein. List mein nahi hai to custom likh sakte hain.
            </div>
            
            {/* Clickable Input Display */}
            <div
              onClick={() => toggleSection('location')}
              className={`${inputClasses} cursor-pointer flex justify-between items-center min-h-[42px]`}
            >
              <div className="flex flex-wrap gap-1">
                {formData.requirements.location.length > 0 ? (
                  formData.requirements.location.map((loc, index) => (
                    <span key={index} className="bg-rose-100 text-rose-800 px-2 py-1 rounded-md text-sm">
                      {loc}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">Select preferred locations...</span>
                )}
              </div>
              <span className="text-gray-400">
                {expandedSections.location ? '▲' : '▼'}
              </span>
            </div>

            {expandedSections.location && (
              <div className="mt-2 border border-gray-300 rounded-lg p-3 bg-gray-50 max-h-48 overflow-y-auto">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Selected: {formData.requirements.location.length}</span>
                  {formData.requirements.location.length > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        formData.requirements.location.forEach(loc => {
                          handleCheckboxChange('location', loc, false);
                        });
                      }}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-1">
                  {['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bangalore', 'Hyderabad', 'London', 'New York', 'Toronto', 'Sydney', 'Dubai', 'Riyadh', 'Same City', 'Any'].map(location => (
                    <label key={location} className="flex items-center space-x-2 p-1 hover:bg-white rounded">
                      <input
                        type="checkbox"
                        checked={formData.requirements.location.includes(location)}
                        onChange={(e) => handleCheckboxChange('location', location, e.target.checked)}
                        className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                      />
                      <span className="text-sm text-gray-700">{location}</span>
                    </label>
                  ))}
                </div>
                
                {/* Custom Location Input */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2 text-sm">Other Location (Custom)</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter custom location"
                      value={customReqLocation}
                      onChange={(e) => setCustomReqLocation(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && customReqLocation.trim()) {
                          e.preventDefault();
                          handleCheckboxChange('location', customReqLocation.trim(), true);
                          setCustomReqLocation('');
                        }
                      }}
                      className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-400/50 focus:border-rose-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customReqLocation.trim()) {
                          handleCheckboxChange('location', customReqLocation.trim(), true);
                          setCustomReqLocation('');
                        }
                      }}
                      className="px-3 py-1.5 text-xs bg-rose-500 text-white rounded-lg hover:bg-rose-600"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
