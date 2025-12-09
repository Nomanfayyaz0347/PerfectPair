'use client';

import { FormData } from './types';

type SectionType = 'cast' | 'maslak' | 'maritalStatus' | 'motherTongue' | 'belongs' | 'houseType' | 'location';

interface Step16Props {
  formData: FormData;
  validationErrors: Record<string, string>;
  expandedSections: { cast: boolean; maslak: boolean; houseType: boolean };
  toggleSection: (section: SectionType) => void;
  handleCheckboxChange: (field: SectionType, value: string, checked: boolean) => void;
  customReqCast: string;
  setCustomReqCast: React.Dispatch<React.SetStateAction<string>>;
  customReqMaslak: string;
  setCustomReqMaslak: React.Dispatch<React.SetStateAction<string>>;
  customReqHouseType: string;
  setCustomReqHouseType: React.Dispatch<React.SetStateAction<string>>;
}

export default function Step16PartnerCastMaslak({ 
  formData, 
  validationErrors,
  expandedSections,
  toggleSection,
  handleCheckboxChange,
  customReqCast,
  setCustomReqCast,
  customReqMaslak,
  setCustomReqMaslak,
  customReqHouseType,
  setCustomReqHouseType
}: Step16Props) {
  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl relative overflow-hidden -mx-5">
      <div className="px-5 py-6">
        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-teal-100 rounded-full translate-y-8 -translate-x-8 opacity-50"></div>
        
        <div className="relative z-10 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🏷️</span>
            </div>
            <h2 className="text-lg font-bold text-gray-800">Partner Cast & Maslak</h2>
          </div>
          <p className="text-sm text-gray-600 ml-11">Cast and religious sect preferences</p>
        </div>
        
        <div className="space-y-4 relative z-10">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Cast
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
              💡 Apne ideal partner ki cast select karein. List mein nahi hai to custom bhi likh sakte hain.
            </div>
            {validationErrors.cast && (
              <p className="text-red-500 text-xs mb-1">{validationErrors.cast}</p>
            )}
            
            {/* Clickable Input Display */}
            <div 
              className="mb-2 min-h-[40px] p-3 border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-emerald-300 transition-colors"
              onClick={() => toggleSection('cast')}
            >
              {formData.requirements.cast.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {formData.requirements.cast.map(cast => (
                    <span key={cast} className="inline-flex items-center px-2 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-md">
                      {cast}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckboxChange('cast', cast, false);
                        }}
                        className="ml-1 text-emerald-600 hover:text-emerald-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <span className="text-xs text-gray-500 ml-2 self-center">Click to add more</span>
                </div>
              ) : (
                <span className="text-gray-400 text-sm">Click to select preferred casts</span>
              )}
            </div>

            {expandedSections.cast && (
              <div className="space-y-3 max-h-48 overflow-y-auto p-3 border border-gray-200 rounded-lg bg-gray-50">
                {/* Major Casts */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 text-sm">Major Casts</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['Rajput', 'Jat', 'Gujjar', 'Awan', 'Arain', 'Sheikh', 'Malik', 'Chaudhary'].map(cast => (
                      <label key={cast} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={formData.requirements.cast.includes(cast)}
                          onChange={(e) => handleCheckboxChange('cast', cast, e.target.checked)}
                          className="mr-2 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        {cast}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Religious/Tribal */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 text-sm">Religious/Tribal</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['Syed', 'Qureshi', 'Ansari', 'Mughal', 'Pathan', 'Baloch'].map(cast => (
                      <label key={cast} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={formData.requirements.cast.includes(cast)}
                          onChange={(e) => handleCheckboxChange('cast', cast, e.target.checked)}
                          className="mr-2 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        {cast}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Professional */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 text-sm">Professional</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['Butt', 'Dar', 'Lone', 'Khan', 'Khatri'].map(cast => (
                      <label key={cast} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={formData.requirements.cast.includes(cast)}
                          onChange={(e) => handleCheckboxChange('cast', cast, e.target.checked)}
                          className="mr-2 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        {cast}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Others */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 text-sm">Others</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['Kashmiri', 'Punjabi', 'Sindhi'].map(cast => (
                      <label key={cast} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={formData.requirements.cast.includes(cast)}
                          onChange={(e) => handleCheckboxChange('cast', cast, e.target.checked)}
                          className="mr-2 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        {cast}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Special Options */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 text-sm">Special Options</h4>
                  <div className="space-y-1">
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={formData.requirements.cast.includes('Same Cast')}
                        onChange={(e) => handleCheckboxChange('cast', 'Same Cast', e.target.checked)}
                        className="mr-2 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      Same as Mine
                    </label>
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={formData.requirements.cast.includes('Any')}
                        onChange={(e) => handleCheckboxChange('cast', 'Any', e.target.checked)}
                        className="mr-2 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      Any Cast
                    </label>
                  </div>
                </div>
                
                {/* Custom Cast Input */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 text-sm">Other (Custom)</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter custom cast"
                      value={customReqCast}
                      onChange={(e) => setCustomReqCast(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && customReqCast.trim()) {
                          e.preventDefault();
                          handleCheckboxChange('cast', customReqCast.trim(), true);
                          setCustomReqCast('');
                        }
                      }}
                      className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customReqCast.trim()) {
                          handleCheckboxChange('cast', customReqCast.trim(), true);
                          setCustomReqCast('');
                        }
                      }}
                      className="px-3 py-1.5 text-xs bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Maslak</label>
            <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
              💡 Apne ideal partner ka maslak select karein. Zarurat ho to custom maslak bhi likh sakte hain.
            </div>
            
            {/* Clickable Input Display */}
            <div 
              className="mb-2 min-h-[40px] p-3 border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-blue-300 transition-colors"
              onClick={() => toggleSection('maslak')}
            >
              {formData.requirements.maslak.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {formData.requirements.maslak.map(maslak => (
                    <span key={maslak} className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md">
                      {maslak}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckboxChange('maslak', maslak, false);
                        }}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <span className="text-xs text-gray-500 ml-2 self-center">Click to add more</span>
                </div>
              ) : (
                <span className="text-gray-400 text-sm">Click to select preferred maslak</span>
              )}
            </div>

            {expandedSections.maslak && (
              <div className="space-y-3 max-h-56 overflow-y-auto p-3 border border-gray-200 rounded-lg bg-gray-50">
                {/* Sunni Islam */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 text-sm">Sunni Islam</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['Hanafi', 'Shafi\'i', 'Maliki', 'Hanbali', 'Ahle Hadith', 'Deobandi', 'Barelvi', 'Jamaat-e-Islami'].map(maslak => (
                      <label key={maslak} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={formData.requirements.maslak.includes(maslak)}
                          onChange={(e) => handleCheckboxChange('maslak', maslak, e.target.checked)}
                          className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        {maslak === 'Shafi\'i' ? 'Shafi\'i' : maslak}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Shia Islam */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 text-sm">Shia Islam</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {['Twelver Shia', 'Ismaili', 'Zaidi', 'Alavi Bohra', 'Dawoodi Bohra'].map(maslak => (
                      <label key={maslak} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={formData.requirements.maslak.includes(maslak)}
                          onChange={(e) => handleCheckboxChange('maslak', maslak, e.target.checked)}
                          className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        {maslak}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sufi Orders */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 text-sm">Sufi Orders</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['Chishti', 'Qadri', 'Naqshbandi', 'Suhrawardi'].map(maslak => (
                      <label key={maslak} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={formData.requirements.maslak.includes(maslak)}
                          onChange={(e) => handleCheckboxChange('maslak', maslak, e.target.checked)}
                          className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        {maslak}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Other Islamic Sects */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 text-sm">Other Islamic Sects</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['Ahmadiyya', 'Quranist', 'Non-denominational'].map(maslak => (
                      <label key={maslak} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={formData.requirements.maslak.includes(maslak)}
                          onChange={(e) => handleCheckboxChange('maslak', maslak, e.target.checked)}
                          className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        {maslak}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Other Religions */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 text-sm">Other Religions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['Christian', 'Hindu', 'Sikh', 'Other Religion'].map(maslak => (
                      <label key={maslak} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={formData.requirements.maslak.includes(maslak)}
                          onChange={(e) => handleCheckboxChange('maslak', maslak, e.target.checked)}
                          className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        {maslak}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Special Options */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 text-sm">Special Options</h4>
                  <div className="space-y-1">
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={formData.requirements.maslak.includes('Same Maslak')}
                        onChange={(e) => handleCheckboxChange('maslak', 'Same Maslak', e.target.checked)}
                        className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      Same as Mine
                    </label>
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={formData.requirements.maslak.includes('Any')}
                        onChange={(e) => handleCheckboxChange('maslak', 'Any', e.target.checked)}
                        className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      Any Maslak
                    </label>
                  </div>
                </div>
                
                {/* Custom Maslak Input */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 text-sm">Other (Custom)</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter custom maslak"
                      value={customReqMaslak}
                      onChange={(e) => setCustomReqMaslak(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && customReqMaslak.trim()) {
                          e.preventDefault();
                          handleCheckboxChange('maslak', customReqMaslak.trim(), true);
                          setCustomReqMaslak('');
                        }
                      }}
                      className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400/50 focus:border-blue-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customReqMaslak.trim()) {
                          handleCheckboxChange('maslak', customReqMaslak.trim(), true);
                          setCustomReqMaslak('');
                        }
                      }}
                      className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred House Type</label>
            <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
              💡 Apne ideal partner ke ghar ki qisam select karein. List mein nahi hai to custom bhi likh sakte hain.
            </div>
            
            {/* Clickable Input Display */}
            <div 
              className="mb-2 min-h-[40px] p-3 border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-purple-300 transition-colors"
              onClick={() => toggleSection('houseType')}
            >
              {formData.requirements.houseType.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {formData.requirements.houseType.map(houseType => (
                    <span key={houseType} className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-md">
                      {houseType}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckboxChange('houseType', houseType, false);
                        }}
                        className="ml-1 text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <span className="text-xs text-gray-500 ml-2 self-center">Click to add more</span>
                </div>
              ) : (
                <span className="text-gray-400 text-sm">Click to select preferred house types</span>
              )}
            </div>

            {expandedSections.houseType && (
              <div className="space-y-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="grid grid-cols-2 gap-2">
                  {['Own House', 'Family House', 'Rent', 'Apartment'].map(houseType => (
                    <label key={houseType} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={formData.requirements.houseType.includes(houseType)}
                        onChange={(e) => handleCheckboxChange('houseType', houseType, e.target.checked)}
                        className="mr-2 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      {houseType}
                    </label>
                  ))}
                </div>
                <div>
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={formData.requirements.houseType.includes('Any')}
                      onChange={(e) => handleCheckboxChange('houseType', 'Any', e.target.checked)}
                      className="mr-2 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    Any House Type
                  </label>
                </div>
                
                {/* Custom House Type Input */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 text-sm">Other (Custom)</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter custom house type"
                      value={customReqHouseType}
                      onChange={(e) => setCustomReqHouseType(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && customReqHouseType.trim()) {
                          e.preventDefault();
                          handleCheckboxChange('houseType', customReqHouseType.trim(), true);
                          setCustomReqHouseType('');
                        }
                      }}
                      className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400/50 focus:border-purple-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customReqHouseType.trim()) {
                          handleCheckboxChange('houseType', customReqHouseType.trim(), true);
                          setCustomReqHouseType('');
                        }
                      }}
                      className="px-3 py-1.5 text-xs bg-purple-500 text-white rounded-lg hover:bg-purple-600"
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
