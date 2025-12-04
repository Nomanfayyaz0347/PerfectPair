'use client';

import { Profile } from './types';

interface EditFormEducationCareerProps {
  editData: Profile;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  inputClasses: string;
  selectClasses: string;
}

export default function EditFormEducationCareer({ 
  editData, 
  handleInputChange,
  inputClasses,
  selectClasses
}: EditFormEducationCareerProps) {
  return (
    <div>
      <h2 className="text-lg sm:text-xl text-gray-900 mb-4 heading">Education & Career</h2>
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Education */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Education *</label>
          <input
            type="text"
            name="education"
            value={editData.education}
            onChange={handleInputChange}
            className={inputClasses}
            placeholder="e.g., Bachelor's in Computer Science"
          />
        </div>
        
        {/* Job/Occupation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Job/Business/Occupation *</label>
          <input
            type="text"
            name="occupation"
            value={editData.occupation}
            onChange={handleInputChange}
            className={inputClasses}
            placeholder="e.g., Software Engineer, Doctor, Teacher"
          />
        </div>
        
        {/* Income */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Income/Salary *</label>
          <input
            type="text"
            name="income"
            value={editData.income}
            onChange={handleInputChange}
            className={inputClasses}
            placeholder="e.g., 50,000 PKR, 1 Lakh, As per Requirement"
          />
        </div>

        {/* House Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">House Type *</label>
          <select
            name="houseType"
            value={editData.houseType || 'Family House'}
            onChange={handleInputChange}
            className={selectClasses}
          >
            <option value="Family House">Family House</option>
            <option value="Own House">Own House</option>
            <option value="Rent">Rent</option>
            <option value="Apartment">Apartment</option>
          </select>
        </div>
      </div>
    </div>
  );
}
