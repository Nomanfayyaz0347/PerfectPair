'use client';

import { selectClasses, inputClasses } from './constants';
import { FormData } from './types';

interface SubmissionInfoSectionProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function SubmissionInfoSection({ formData, onChange }: SubmissionInfoSectionProps) {
  return (
    <div className="space-y-4">
      {/* Submitted By */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Submitted By *</label>
        <select
          name="submittedBy"
          value={formData.submittedBy}
          onChange={onChange}
          className={selectClasses}
          required
        >
          <option value="">Select Submitter</option>
          <option value="Main Admin">Main Admin (Direct Client)</option>
          <option value="Partner Matchmaker">Partner Matchmaker</option>
        </select>
      </div>

      {/* Matchmaker Name - Only show if Partner Matchmaker is selected */}
      {formData.submittedBy === 'Partner Matchmaker' && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Matchmaker Name *</label>
          <input
            type="text"
            name="matchmakerName"
            value={formData.matchmakerName || ''}
            onChange={onChange}
            placeholder="Enter partner matchmaker name"
            className={inputClasses}
            required
          />
        </div>
      )}
    </div>
  );
}
