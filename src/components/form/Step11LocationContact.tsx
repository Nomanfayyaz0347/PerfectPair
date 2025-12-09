'use client';

import { FormData } from './types';

interface Step11Props {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  getSelectClasses: (fieldName: string) => string;
  selectClasses: string;
  validationErrors: Record<string, string>;
  showCustomHouseType: boolean;
  setShowCustomHouseType: React.Dispatch<React.SetStateAction<boolean>>;
  customHouseType: string;
  setCustomHouseType: React.Dispatch<React.SetStateAction<string>>;
  showCustomCountry: boolean;
  setShowCustomCountry: React.Dispatch<React.SetStateAction<boolean>>;
  customCountry: string;
  setCustomCountry: React.Dispatch<React.SetStateAction<string>>;
  showCustomCity: boolean;
  setShowCustomCity: React.Dispatch<React.SetStateAction<boolean>>;
  customCity: string;
  setCustomCity: React.Dispatch<React.SetStateAction<string>>;
}

export default function Step11LocationContact({ 
  formData, 
  handleInputChange,
  setFormData,
  getSelectClasses,
  selectClasses,
  validationErrors,
  showCustomHouseType,
  setShowCustomHouseType,
  customHouseType,
  setCustomHouseType,
  showCustomCountry,
  setShowCustomCountry,
  customCountry,
  setCustomCountry,
  showCustomCity,
  setShowCustomCity,
  customCity,
  setCustomCity
}: Step11Props) {
  return (
    <div>
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">📍 Location & Contact</h2>
          <p className="text-xs text-gray-600 mt-1">Address and contact information</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">House Type <span className="text-red-500">*</span></label>
          <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
            💡 Ghar ki qisam select karein - Apna ghar, Family House, Kiray ka, Apartment waghaira. Agar list mein nahi hai to &quot;Other&quot; select karein.
          </div>
          {!showCustomHouseType ? (
            <select
              name="houseType"
              required
              value={formData.houseType}
              onChange={(e) => {
                if (e.target.value === 'Other') {
                  setShowCustomHouseType(true);
                } else {
                  handleInputChange(e);
                }
              }}
              className={selectClasses}
            >
              <option value="">Select House Type</option>
              <option value="Family House">Family House</option>
              <option value="Own House">Own House</option>
              <option value="Rent">Rent</option>
              <option value="Apartment">Apartment</option>
              <option value="Other">Other (Custom)</option>
            </select>
          ) : (
            <div className="relative">
              <input
                type="text"
                placeholder="Enter house type"
                required
                value={customHouseType}
                onChange={(e) => {
                  const value = e.target.value;
                  setCustomHouseType(value);
                  setFormData({ ...formData, houseType: value });
                }}
                className="w-full px-3 py-2.5 pr-12 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 touch-manipulation font-light bg-white"
              />
              <button
                type="button"
                onClick={() => {
                  setShowCustomHouseType(false);
                  setCustomHouseType('');
                  setFormData({ ...formData, houseType: 'Family House' });
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600 hover:text-gray-800 bg-gray-100 px-2 py-1 rounded"
              >
                ↩️
              </button>
            </div>
          )}
          {validationErrors['houseType'] && (
            <p className="mt-1 text-xs text-red-600">
              {validationErrors['houseType']}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country <span className="text-red-500">*</span></label>
            <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
              💡 Jis mulk mein rehte hain woh select karein.
            </div>
            {!showCustomCountry ? (
              <select
                name="country"
                required
                value={formData.country}
                onChange={(e) => {
                  if (e.target.value === 'Other') {
                    setShowCustomCountry(true);
                    setFormData({ ...formData, country: '' });
                  } else {
                    handleInputChange(e);
                  }
                }}
                className={getSelectClasses('country')}
              >
                <option value="Pakistan">Pakistan 🇵🇰</option>
                <option value="Bangladesh">Bangladesh 🇧🇩</option>
                <option value="India">India 🇮🇳</option>
                <option value="Afghanistan">Afghanistan 🇦🇫</option>
                <option value="Iran">Iran 🇮🇷</option>
                <option value="Turkey">Turkey 🇹🇷</option>
                <option value="Saudi Arabia">Saudi Arabia 🇸🇦</option>
                <option value="UAE">UAE 🇦🇪</option>
                <option value="UK">UK 🇬🇧</option>
                <option value="USA">USA 🇺🇸</option>
                <option value="Canada">Canada 🇨🇦</option>
                <option value="Australia">Australia 🇦🇺</option>
                <option value="Other">Other (Custom)</option>
              </select>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter country"
                  required
                  value={customCountry}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCustomCountry(value);
                    setFormData({ ...formData, country: value });
                  }}
                  className="w-full px-3 py-2.5 pr-12 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 touch-manipulation font-light bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomCountry(false);
                    setCustomCountry('');
                    setFormData({ ...formData, country: 'Pakistan' });
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600 hover:text-gray-800 bg-gray-100 px-2 py-1 rounded"
                >
                  ↩️
                </button>
              </div>
            )}
            {validationErrors['country'] && (
              <p className="mt-1 text-xs text-red-600">
                {validationErrors['country']}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City <span className="text-red-500">*</span></label>
            <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
              💡 Apna sheher select karein. Agar list mein nahi hai to &quot;Other&quot; select karke khud likhen.
            </div>
            {!showCustomCity ? (
              <select
                name="city"
                required
                value={formData.city}
                onChange={(e) => {
                  if (e.target.value === 'Other') {
                    setShowCustomCity(true);
                    setFormData({ ...formData, city: '' });
                  } else {
                    handleInputChange(e);
                  }
                }}
                className={getSelectClasses('city')}
              >
                {/* Pakistan Cities */}
                <optgroup label="Pakistan 🇵🇰">
                  <option value="Karachi">Karachi</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Multan">Multan</option>
                  <option value="Peshawar">Peshawar</option>
                  <option value="Quetta">Quetta</option>
                  <option value="Sialkot">Sialkot</option>
                  <option value="Gujranwala">Gujranwala</option>
                </optgroup>
                
                {/* Bangladesh Cities */}
                <optgroup label="Bangladesh 🇧🇩">
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Khulna">Khulna</option>
                </optgroup>
                
                {/* India Cities */}
                <optgroup label="India 🇮🇳">
                  <option value="Delhi">Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Hyderabad">Hyderabad</option>
                </optgroup>
                
                {/* International Cities */}
                <optgroup label="International 🌍">
                  <option value="London">London</option>
                  <option value="New York">New York</option>
                  <option value="Toronto">Toronto</option>
                  <option value="Sydney">Sydney</option>
                  <option value="Dubai">Dubai</option>
                  <option value="Riyadh">Riyadh</option>
                </optgroup>
                
                <option value="Other">Other (Custom)</option>
              </select>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter city"
                  required
                  value={customCity}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCustomCity(value);
                    setFormData({ ...formData, city: value });
                  }}
                  className="w-full px-3 py-2.5 pr-12 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 touch-manipulation font-light bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomCity(false);
                    setCustomCity('');
                    setFormData({ ...formData, city: 'Karachi' });
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600 hover:text-gray-800 bg-gray-100 px-2 py-1 rounded"
                >
                  ↩️
                </button>
              </div>
            )}
            {validationErrors['city'] && (
              <p className="mt-1 text-xs text-red-600">
                {validationErrors['city']}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
