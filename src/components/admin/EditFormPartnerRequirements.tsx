'use client';

import { Profile } from './types';

interface EditFormPartnerRequirementsProps {
  editData: Profile;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  inputClasses: string;
}

export default function EditFormPartnerRequirements({ 
  editData, 
  handleInputChange,
  inputClasses
}: EditFormPartnerRequirementsProps) {
  return (
    <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-xl relative overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-pink-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-100 rounded-full translate-y-8 -translate-x-8 opacity-50"></div>
        
        {/* Header */}
        <div className="relative z-10 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">💕</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Partner Requirements</h2>
          </div>
          <p className="text-sm text-gray-600 ml-11">Edit your ideal life partner preferences</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:gap-6 relative z-10">
          {/* Age Range */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <span className="text-pink-500">🎂</span>
              Preferred Age Range
            </label>
            <input
              type="text"
              name="requirements.ageRange"
              value={`${editData.requirements.ageRange.min}-${editData.requirements.ageRange.max}`}
              onChange={handleInputChange}
              placeholder="e.g., 25-35"
              className={inputClasses}
            />
          </div>
          
          {/* Height Range */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <span className="text-pink-500">📏</span>
              Preferred Height Range
            </label>
            <input
              type="text"
              name="requirements.heightRange"
              value={`${editData.requirements.heightRange.min}-${editData.requirements.heightRange.max}`}
              onChange={handleInputChange}
              placeholder="e.g., 5.2-6.0"
              className={inputClasses}
            />
          </div>

          {/* Education & Occupation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <span className="text-pink-500">🎓</span>
                Education Preference
              </label>
              <input
                type="text"
                name="requirements.education"
                value={editData.requirements.education}
                onChange={handleInputChange}
                placeholder="Any, Bachelor's, Master's, etc."
                className={inputClasses}
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <span className="text-pink-500">💼</span>
                Occupation Preference
              </label>
              <input
                type="text"
                name="requirements.occupation"
                value={editData.requirements.occupation}
                onChange={handleInputChange}
                placeholder="Any, Doctor, Engineer, etc."
                className={inputClasses}
              />
            </div>
          </div>

          {/* Family Type */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <span className="text-pink-500">🏠</span>
              Family Type Preference
            </label>
            <input
              type="text"
              name="requirements.familyType"
              value={editData.requirements.familyType || ''}
              onChange={handleInputChange}
              placeholder="Joint, Nuclear, Any"
              className={inputClasses}
            />
          </div>

          {/* Location */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <span className="text-pink-500">📍</span>
              Location Preference (comma separated)
            </label>
            <input
              type="text"
              name="requirements.location"
              value={Array.isArray(editData.requirements.location) ? editData.requirements.location.join(', ') : editData.requirements.location || ''}
              onChange={(e) => {
                const value = e.target.value;
                const locationArray = value.split(',').map(item => item.trim()).filter(item => item);
                handleInputChange({
                  target: {
                    name: 'requirements.location',
                    value: locationArray.join(', ')
                  }
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              placeholder="Karachi, Lahore, Any"
              className={inputClasses}
            />
          </div>

          {/* Cast Preference */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <span className="text-pink-500">👥</span>
              Cast Preference (comma separated)
            </label>
            <input
              type="text"
              name="requirements.cast"
              value={Array.isArray(editData.requirements.cast) ? editData.requirements.cast.join(', ') : editData.requirements.cast || ''}
              onChange={(e) => {
                const value = e.target.value;
                const castArray = value.split(',').map(item => item.trim()).filter(item => item);
                handleInputChange({
                  target: {
                    name: 'requirements.cast',
                    value: castArray.join(', ')
                  }
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              placeholder="Same Cast, Any, Rajput, Shaikh"
              className={inputClasses}
            />
          </div>

          {/* Maslak Preference */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <span className="text-pink-500">🕌</span>
              Maslak Preference (comma separated)
            </label>
            <input
              type="text"
              name="requirements.maslak"
              value={Array.isArray(editData.requirements.maslak) ? editData.requirements.maslak.join(', ') : editData.requirements.maslak || ''}
              onChange={(e) => {
                const value = e.target.value;
                const maslakArray = value.split(',').map(item => item.trim()).filter(item => item);
                handleInputChange({
                  target: {
                    name: 'requirements.maslak',
                    value: maslakArray.join(', ')
                  }
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              placeholder="Sunni, Shia, Any"
              className={inputClasses}
            />
          </div>

          {/* Marital Status Preference */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <span className="text-pink-500">💍</span>
              Preferred Marital Status (comma separated)
            </label>
            <input
              type="text"
              name="requirements.maritalStatus"
              value={Array.isArray(editData.requirements.maritalStatus) ? editData.requirements.maritalStatus.join(', ') : editData.requirements.maritalStatus || ''}
              onChange={(e) => {
                const value = e.target.value;
                const statusArray = value.split(',').map(item => item.trim()).filter(item => item);
                handleInputChange({
                  target: {
                    name: 'requirements.maritalStatus',
                    value: statusArray.join(', ')
                  }
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              placeholder="Single, Divorced, Widowed"
              className={inputClasses}
            />
          </div>

          {/* Mother Tongue Preference */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <span className="text-pink-500">🗣️</span>
              Mother Tongue Preference (comma separated)
            </label>
            <input
              type="text"
              name="requirements.motherTongue"
              value={Array.isArray(editData.requirements.motherTongue) ? editData.requirements.motherTongue.join(', ') : editData.requirements.motherTongue || ''}
              onChange={(e) => {
                const value = e.target.value;
                const tongueArray = value.split(',').map(item => item.trim()).filter(item => item);
                handleInputChange({
                  target: {
                    name: 'requirements.motherTongue',
                    value: tongueArray.join(', ')
                  }
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              placeholder="Urdu, English, Punjabi"
              className={inputClasses}
            />
          </div>

          {/* Nationality/Origin Preference */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <span className="text-pink-500">🌍</span>
              Nationality/Origin Preference (comma separated)
            </label>
            <input
              type="text"
              name="requirements.belongs"
              value={Array.isArray(editData.requirements.belongs) ? editData.requirements.belongs.join(', ') : editData.requirements.belongs || ''}
              onChange={(e) => {
                const value = e.target.value;
                const belongsArray = value.split(',').map(item => item.trim()).filter(item => item);
                handleInputChange({
                  target: {
                    name: 'requirements.belongs',
                    value: belongsArray.join(', ')
                  }
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              placeholder="Pakistan, Bangladesh, Any"
              className={inputClasses}
            />
          </div>

          {/* House Type Preference */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <span className="text-pink-500">🏡</span>
              House Type Preference (comma separated)
            </label>
            <input
              type="text"
              name="requirements.houseType"
              value={Array.isArray(editData.requirements.houseType) ? editData.requirements.houseType.join(', ') : editData.requirements.houseType || ''}
              onChange={(e) => {
                const value = e.target.value;
                const houseArray = value.split(',').map(item => item.trim()).filter(item => item);
                handleInputChange({
                  target: {
                    name: 'requirements.houseType',
                    value: houseArray.join(', ')
                  }
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              placeholder="Own House, Rent, Any"
              className={inputClasses}
            />
          </div>

          <p className="text-sm text-gray-600 bg-white/80 p-3 rounded-lg">
            💡 <strong>Tip:</strong> For multiple preferences, separate with commas. Example: &quot;Single, Divorced&quot; or &quot;Same Cast, Any&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
