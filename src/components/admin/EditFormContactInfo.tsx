'use client';

import { Profile } from './types';

interface EditFormContactInfoProps {
  editData: Profile;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  inputClasses: string;
}

export default function EditFormContactInfo({ 
  editData, 
  handleInputChange,
  inputClasses
}: EditFormContactInfoProps) {
  return (
    <div>
      <h2 className="text-lg sm:text-xl text-gray-900 mb-4 heading">Contact Information</h2>
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Country and City */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
            <input
              type="text"
              name="country"
              value={editData.country || ''}
              onChange={handleInputChange}
              className={inputClasses}
              placeholder="Pakistan"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
            <input
              type="text"
              name="city"
              value={editData.city || ''}
              onChange={handleInputChange}
              className={inputClasses}
              placeholder="Karachi"
            />
          </div>
        </div>
        
        {/* Contact Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
          <input
            type="tel"
            name="contactNumber"
            value={editData.contactNumber}
            onChange={handleInputChange}
            className={inputClasses}
            placeholder="+92 300 1234567"
          />
        </div>
      </div>
    </div>
  );
}
