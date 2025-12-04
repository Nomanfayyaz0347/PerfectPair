'use client';

import { inputClasses, textareaClasses, selectClasses } from './constants';
import { FormData } from './types';

interface FamilyInfoSectionProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function FamilyInfoSection({ formData, onChange }: FamilyInfoSectionProps) {
  return (
    <div className="space-y-4">
      {/* Parents Status */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Father</label>
          <select
            name="fatherAlive"
            value={formData.fatherAlive ? 'alive' : 'deceased'}
            onChange={(e) => {
              const syntheticEvent = {
                target: { name: 'fatherAlive', value: e.target.value === 'alive' }
              } as unknown as React.ChangeEvent<HTMLSelectElement>;
              onChange(syntheticEvent);
            }}
            className={selectClasses}
          >
            <option value="alive">Alive</option>
            <option value="deceased">Deceased</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Mother</label>
          <select
            name="motherAlive"
            value={formData.motherAlive ? 'alive' : 'deceased'}
            onChange={(e) => {
              const syntheticEvent = {
                target: { name: 'motherAlive', value: e.target.value === 'alive' }
              } as unknown as React.ChangeEvent<HTMLSelectElement>;
              onChange(syntheticEvent);
            }}
            className={selectClasses}
          >
            <option value="alive">Alive</option>
            <option value="deceased">Deceased</option>
          </select>
        </div>
      </div>

      {/* Brothers */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">No. of Brothers</label>
          <input
            type="number"
            name="numberOfBrothers"
            value={formData.numberOfBrothers || ''}
            onChange={onChange}
            min="0"
            max="20"
            className={inputClasses}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Married Brothers</label>
          <input
            type="number"
            name="numberOfMarriedBrothers"
            value={formData.numberOfMarriedBrothers || ''}
            onChange={onChange}
            min="0"
            max="20"
            className={inputClasses}
          />
        </div>
      </div>

      {/* Sisters */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">No. of Sisters</label>
          <input
            type="number"
            name="numberOfSisters"
            value={formData.numberOfSisters || ''}
            onChange={onChange}
            min="0"
            max="20"
            className={inputClasses}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Married Sisters</label>
          <input
            type="number"
            name="numberOfMarriedSisters"
            value={formData.numberOfMarriedSisters || ''}
            onChange={onChange}
            min="0"
            max="20"
            className={inputClasses}
          />
        </div>
      </div>

      {/* Family Details */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Family Details</label>
        <textarea
          name="familyDetails"
          value={formData.familyDetails}
          onChange={onChange}
          rows={3}
          placeholder="Brief description about family background..."
          className={textareaClasses}
        />
      </div>
    </div>
  );
}
