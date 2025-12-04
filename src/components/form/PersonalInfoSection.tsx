'use client';

import { inputClasses, selectClasses } from './constants';
import {
  castOptions,
  maslakOptions,
  maritalStatusOptions,
  motherTongueOptions,
  belongsOptions,
  complexionOptions,
  educationOptions,
  occupationOptions,
  houseTypeOptions,
  countryOptions,
  cityOptions,
} from './constants';
import { FormData } from './types';

interface PersonalInfoSectionProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  showCustomCast: boolean;
  setShowCustomCast: (show: boolean) => void;
  customCast: string;
  setCustomCast: (value: string) => void;
  showCustomMaslak: boolean;
  setShowCustomMaslak: (show: boolean) => void;
  customMaslak: string;
  setCustomMaslak: (value: string) => void;
  showCustomMaritalStatus: boolean;
  setShowCustomMaritalStatus: (show: boolean) => void;
  customMaritalStatus: string;
  setCustomMaritalStatus: (value: string) => void;
  showCustomMotherTongue: boolean;
  setShowCustomMotherTongue: (show: boolean) => void;
  customMotherTongue: string;
  setCustomMotherTongue: (value: string) => void;
  showCustomBelongs: boolean;
  setShowCustomBelongs: (show: boolean) => void;
  customBelongs: string;
  setCustomBelongs: (value: string) => void;
  showCustomComplexion: boolean;
  setShowCustomComplexion: (show: boolean) => void;
  customComplexion: string;
  setCustomComplexion: (value: string) => void;
  showCustomEducation: boolean;
  setShowCustomEducation: (show: boolean) => void;
  customEducation: string;
  setCustomEducation: (value: string) => void;
  showCustomOccupation: boolean;
  setShowCustomOccupation: (show: boolean) => void;
  customOccupation: string;
  setCustomOccupation: (value: string) => void;
  showCustomHouseType: boolean;
  setShowCustomHouseType: (show: boolean) => void;
  customHouseType: string;
  setCustomHouseType: (value: string) => void;
  showCustomCountry: boolean;
  setShowCustomCountry: (show: boolean) => void;
  customCountry: string;
  setCustomCountry: (value: string) => void;
  showCustomCity: boolean;
  setShowCustomCity: (show: boolean) => void;
  customCity: string;
  setCustomCity: (value: string) => void;
}

export default function PersonalInfoSection({
  formData,
  onChange,
  showCustomCast,
  setShowCustomCast,
  customCast,
  setCustomCast,
  showCustomMaslak,
  setShowCustomMaslak,
  customMaslak,
  setCustomMaslak,
  showCustomMaritalStatus,
  setShowCustomMaritalStatus,
  customMaritalStatus,
  setCustomMaritalStatus,
  showCustomMotherTongue,
  setShowCustomMotherTongue,
  customMotherTongue,
  setCustomMotherTongue,
  showCustomBelongs,
  setShowCustomBelongs,
  customBelongs,
  setCustomBelongs,
  showCustomComplexion,
  setShowCustomComplexion,
  customComplexion,
  setCustomComplexion,
  showCustomEducation,
  setShowCustomEducation,
  customEducation,
  setCustomEducation,
  showCustomOccupation,
  setShowCustomOccupation,
  customOccupation,
  setCustomOccupation,
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
  setCustomCity,
}: PersonalInfoSectionProps) {
  
  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    setShowCustom: (show: boolean) => void,
    setCustomValue: (value: string) => void
  ) => {
    const value = e.target.value;
    if (value === 'Other') {
      setShowCustom(true);
      setCustomValue('');
    } else {
      setShowCustom(false);
      onChange(e);
    }
  };

  return (
    <div className="space-y-4">
      {/* Name and Father's Name */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            className={inputClasses}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Father&apos;s Name *</label>
          <input
            type="text"
            name="fatherName"
            value={formData.fatherName}
            onChange={onChange}
            className={inputClasses}
            required
          />
        </div>
      </div>

      {/* Gender and Age */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Gender *</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={onChange}
            className={selectClasses}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Age *</label>
          <input
            type="number"
            name="age"
            value={formData.age || ''}
            onChange={onChange}
            className={inputClasses}
            min="18"
            max="99"
            required
          />
        </div>
      </div>

      {/* Height and Weight */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Height *</label>
          <input
            type="text"
            name="height"
            value={formData.height}
            onChange={onChange}
            placeholder="e.g., 5.8"
            className={inputClasses}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Weight (kg)</label>
          <input
            type="text"
            name="weight"
            value={formData.weight}
            onChange={onChange}
            placeholder="e.g., 70"
            className={inputClasses}
          />
        </div>
      </div>

      {/* Complexion */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Complexion</label>
        {showCustomComplexion ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={customComplexion}
              onChange={(e) => setCustomComplexion(e.target.value)}
              placeholder="Enter complexion"
              className={inputClasses}
            />
            <button
              type="button"
              onClick={() => {
                if (customComplexion.trim()) {
                  const syntheticEvent = {
                    target: { name: 'color', value: customComplexion.trim() }
                  } as React.ChangeEvent<HTMLSelectElement>;
                  onChange(syntheticEvent);
                }
                setShowCustomComplexion(false);
              }}
              className="px-3 py-2 bg-emerald-500 text-white rounded-lg text-xs"
            >
              Add
            </button>
          </div>
        ) : (
          <select
            name="color"
            value={formData.color}
            onChange={(e) => handleSelectChange(e, setShowCustomComplexion, setCustomComplexion)}
            className={selectClasses}
          >
            <option value="">Select Complexion</option>
            {complexionOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )}
      </div>

      {/* Cast */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Cast *</label>
        {showCustomCast ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={customCast}
              onChange={(e) => setCustomCast(e.target.value)}
              placeholder="Enter cast"
              className={inputClasses}
            />
            <button
              type="button"
              onClick={() => {
                if (customCast.trim()) {
                  const syntheticEvent = {
                    target: { name: 'cast', value: customCast.trim() }
                  } as React.ChangeEvent<HTMLSelectElement>;
                  onChange(syntheticEvent);
                }
                setShowCustomCast(false);
              }}
              className="px-3 py-2 bg-emerald-500 text-white rounded-lg text-xs"
            >
              Add
            </button>
          </div>
        ) : (
          <select
            name="cast"
            value={formData.cast}
            onChange={(e) => handleSelectChange(e, setShowCustomCast, setCustomCast)}
            className={selectClasses}
            required
          >
            <option value="">Select Cast</option>
            {castOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )}
      </div>

      {/* Maslak */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Maslak</label>
        {showCustomMaslak ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={customMaslak}
              onChange={(e) => setCustomMaslak(e.target.value)}
              placeholder="Enter maslak"
              className={inputClasses}
            />
            <button
              type="button"
              onClick={() => {
                if (customMaslak.trim()) {
                  const syntheticEvent = {
                    target: { name: 'maslak', value: customMaslak.trim() }
                  } as React.ChangeEvent<HTMLSelectElement>;
                  onChange(syntheticEvent);
                }
                setShowCustomMaslak(false);
              }}
              className="px-3 py-2 bg-emerald-500 text-white rounded-lg text-xs"
            >
              Add
            </button>
          </div>
        ) : (
          <select
            name="maslak"
            value={formData.maslak}
            onChange={(e) => handleSelectChange(e, setShowCustomMaslak, setCustomMaslak)}
            className={selectClasses}
          >
            <option value="">Select Maslak</option>
            {maslakOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )}
      </div>

      {/* Marital Status */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Marital Status *</label>
        {showCustomMaritalStatus ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={customMaritalStatus}
              onChange={(e) => setCustomMaritalStatus(e.target.value)}
              placeholder="Enter marital status"
              className={inputClasses}
            />
            <button
              type="button"
              onClick={() => {
                if (customMaritalStatus.trim()) {
                  const syntheticEvent = {
                    target: { name: 'maritalStatus', value: customMaritalStatus.trim() }
                  } as React.ChangeEvent<HTMLSelectElement>;
                  onChange(syntheticEvent);
                }
                setShowCustomMaritalStatus(false);
              }}
              className="px-3 py-2 bg-emerald-500 text-white rounded-lg text-xs"
            >
              Add
            </button>
          </div>
        ) : (
          <select
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={(e) => handleSelectChange(e, setShowCustomMaritalStatus, setCustomMaritalStatus)}
            className={selectClasses}
            required
          >
            <option value="">Select Status</option>
            {maritalStatusOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )}
      </div>

      {/* Mother Tongue */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Mother Tongue</label>
        {showCustomMotherTongue ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={customMotherTongue}
              onChange={(e) => setCustomMotherTongue(e.target.value)}
              placeholder="Enter mother tongue"
              className={inputClasses}
            />
            <button
              type="button"
              onClick={() => {
                if (customMotherTongue.trim()) {
                  const syntheticEvent = {
                    target: { name: 'motherTongue', value: customMotherTongue.trim() }
                  } as React.ChangeEvent<HTMLSelectElement>;
                  onChange(syntheticEvent);
                }
                setShowCustomMotherTongue(false);
              }}
              className="px-3 py-2 bg-emerald-500 text-white rounded-lg text-xs"
            >
              Add
            </button>
          </div>
        ) : (
          <select
            name="motherTongue"
            value={formData.motherTongue}
            onChange={(e) => handleSelectChange(e, setShowCustomMotherTongue, setCustomMotherTongue)}
            className={selectClasses}
          >
            <option value="">Select Mother Tongue</option>
            {motherTongueOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )}
      </div>

      {/* Belongs To */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Belongs To</label>
        {showCustomBelongs ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={customBelongs}
              onChange={(e) => setCustomBelongs(e.target.value)}
              placeholder="Enter country/region"
              className={inputClasses}
            />
            <button
              type="button"
              onClick={() => {
                if (customBelongs.trim()) {
                  const syntheticEvent = {
                    target: { name: 'belongs', value: customBelongs.trim() }
                  } as React.ChangeEvent<HTMLSelectElement>;
                  onChange(syntheticEvent);
                }
                setShowCustomBelongs(false);
              }}
              className="px-3 py-2 bg-emerald-500 text-white rounded-lg text-xs"
            >
              Add
            </button>
          </div>
        ) : (
          <select
            name="belongs"
            value={formData.belongs}
            onChange={(e) => handleSelectChange(e, setShowCustomBelongs, setCustomBelongs)}
            className={selectClasses}
          >
            <option value="">Select Country</option>
            {belongsOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )}
      </div>

      {/* Education */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Education *</label>
        {showCustomEducation ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={customEducation}
              onChange={(e) => setCustomEducation(e.target.value)}
              placeholder="Enter education"
              className={inputClasses}
            />
            <button
              type="button"
              onClick={() => {
                if (customEducation.trim()) {
                  const syntheticEvent = {
                    target: { name: 'education', value: customEducation.trim() }
                  } as React.ChangeEvent<HTMLSelectElement>;
                  onChange(syntheticEvent);
                }
                setShowCustomEducation(false);
              }}
              className="px-3 py-2 bg-emerald-500 text-white rounded-lg text-xs"
            >
              Add
            </button>
          </div>
        ) : (
          <select
            name="education"
            value={formData.education}
            onChange={(e) => handleSelectChange(e, setShowCustomEducation, setCustomEducation)}
            className={selectClasses}
            required
          >
            <option value="">Select Education</option>
            {educationOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )}
      </div>

      {/* Occupation */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Occupation *</label>
        {showCustomOccupation ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={customOccupation}
              onChange={(e) => setCustomOccupation(e.target.value)}
              placeholder="Enter occupation"
              className={inputClasses}
            />
            <button
              type="button"
              onClick={() => {
                if (customOccupation.trim()) {
                  const syntheticEvent = {
                    target: { name: 'occupation', value: customOccupation.trim() }
                  } as React.ChangeEvent<HTMLSelectElement>;
                  onChange(syntheticEvent);
                }
                setShowCustomOccupation(false);
              }}
              className="px-3 py-2 bg-emerald-500 text-white rounded-lg text-xs"
            >
              Add
            </button>
          </div>
        ) : (
          <select
            name="occupation"
            value={formData.occupation}
            onChange={(e) => handleSelectChange(e, setShowCustomOccupation, setCustomOccupation)}
            className={selectClasses}
            required
          >
            <option value="">Select Occupation</option>
            {occupationOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )}
      </div>

      {/* Income */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Income</label>
        <input
          type="text"
          name="income"
          value={formData.income}
          onChange={onChange}
          placeholder="e.g., 50,000 - 100,000"
          className={inputClasses}
        />
      </div>

      {/* House Type */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">House Type</label>
        {showCustomHouseType ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={customHouseType}
              onChange={(e) => setCustomHouseType(e.target.value)}
              placeholder="Enter house type"
              className={inputClasses}
            />
            <button
              type="button"
              onClick={() => {
                if (customHouseType.trim()) {
                  const syntheticEvent = {
                    target: { name: 'houseType', value: customHouseType.trim() }
                  } as React.ChangeEvent<HTMLSelectElement>;
                  onChange(syntheticEvent);
                }
                setShowCustomHouseType(false);
              }}
              className="px-3 py-2 bg-emerald-500 text-white rounded-lg text-xs"
            >
              Add
            </button>
          </div>
        ) : (
          <select
            name="houseType"
            value={formData.houseType}
            onChange={(e) => handleSelectChange(e, setShowCustomHouseType, setCustomHouseType)}
            className={selectClasses}
          >
            <option value="">Select House Type</option>
            {houseTypeOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )}
      </div>

      {/* Country and City */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Country</label>
          {showCustomCountry ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={customCountry}
                onChange={(e) => setCustomCountry(e.target.value)}
                placeholder="Enter country"
                className={inputClasses}
              />
              <button
                type="button"
                onClick={() => {
                  if (customCountry.trim()) {
                    const syntheticEvent = {
                      target: { name: 'country', value: customCountry.trim() }
                    } as React.ChangeEvent<HTMLSelectElement>;
                    onChange(syntheticEvent);
                  }
                  setShowCustomCountry(false);
                }}
                className="px-2 py-2 bg-emerald-500 text-white rounded-lg text-xs"
              >
                ✓
              </button>
            </div>
          ) : (
            <select
              name="country"
              value={formData.country}
              onChange={(e) => handleSelectChange(e, setShowCustomCountry, setCustomCountry)}
              className={selectClasses}
            >
              <option value="">Select Country</option>
              {countryOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
          {showCustomCity ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                placeholder="Enter city"
                className={inputClasses}
              />
              <button
                type="button"
                onClick={() => {
                  if (customCity.trim()) {
                    const syntheticEvent = {
                      target: { name: 'city', value: customCity.trim() }
                    } as React.ChangeEvent<HTMLSelectElement>;
                    onChange(syntheticEvent);
                  }
                  setShowCustomCity(false);
                }}
                className="px-2 py-2 bg-emerald-500 text-white rounded-lg text-xs"
              >
                ✓
              </button>
            </div>
          ) : (
            <select
              name="city"
              value={formData.city}
              onChange={(e) => handleSelectChange(e, setShowCustomCity, setCustomCity)}
              className={selectClasses}
            >
              <option value="">Select City</option>
              {cityOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Contact Number */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Contact Number *</label>
        <input
          type="tel"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={onChange}
          placeholder="e.g., 03001234567"
          className={inputClasses}
          required
        />
      </div>
    </div>
  );
}
