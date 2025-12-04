'use client';

import { Profile } from './types';

interface EditFormSubmissionDetailsProps {
  editData: Profile;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  inputClasses: string;
  selectClasses: string;
}

export default function EditFormSubmissionDetails({ 
  editData, 
  handleInputChange,
  inputClasses,
  selectClasses
}: EditFormSubmissionDetailsProps) {
  return (
    <div>
      <h2 className="text-lg sm:text-xl text-gray-900 mb-4 heading">Profile Submission Details</h2>
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Submission Type - 50/50 Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-blue-500">👤</span> Submitted By
            </label>
            <select
              name="submittedBy"
              value={editData.submittedBy || ''}
              onChange={handleInputChange}
              className={selectClasses}
            >
              <option value="">Not Specified</option>
              <option value="Main Admin">Main Admin (Direct Client)</option>
              <option value="Partner Matchmaker">Partner Matchmaker</option>
            </select>
          </div>

          {/* Matchmaker Name - Only show if Partner Matchmaker is selected */}
          {editData.submittedBy === 'Partner Matchmaker' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-green-500">🤝</span> Matchmaker Name
              </label>
              <input
                type="text"
                name="matchmakerName"
                value={editData.matchmakerName || ''}
                onChange={handleInputChange}
                className={inputClasses}
                placeholder="Enter matchmaker's name"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
