'use client';

import { Profile } from './types';

interface EditFormFamilyDetailsProps {
  editData: Profile;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  inputClasses: string;
  textareaClasses: string;
}

export default function EditFormFamilyDetails({ 
  editData, 
  handleInputChange,
  inputClasses,
  textareaClasses
}: EditFormFamilyDetailsProps) {
  return (
    <div>
      <h2 className="text-lg sm:text-xl text-gray-900 mb-4 heading">Family Details</h2>
      <div className="space-y-4 sm:space-y-6">
        {/* Parents Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Father Status</label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="fatherAlive"
                name="fatherAlive"
                checked={editData.fatherAlive}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-emerald-400 focus:ring-emerald-400/50"
              />
              <label htmlFor="fatherAlive" className="text-sm text-gray-600">Father is Living</label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mother Status</label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="motherAlive"
                name="motherAlive"
                checked={editData.motherAlive}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-emerald-400 focus:ring-emerald-400/50"
              />
              <label htmlFor="motherAlive" className="text-sm text-gray-600">Mother is Living</label>
            </div>
          </div>
        </div>

        {/* Siblings Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Brothers</h3>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Total Brothers</label>
                <input
                  type="number"
                  name="numberOfBrothers"
                  value={editData.numberOfBrothers}
                  onFocus={(e) => e.target.value === '0' && (e.target.value = '')}
                  onChange={handleInputChange}
                  min="0"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Married Brothers</label>
                <input
                  type="number"
                  name="numberOfMarriedBrothers"
                  value={editData.numberOfMarriedBrothers}
                  onFocus={(e) => e.target.value === '0' && (e.target.value = '')}
                  onChange={handleInputChange}
                  min="0"
                  max={editData.numberOfBrothers}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Sisters</h3>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Total Sisters</label>
                <input
                  type="number"
                  name="numberOfSisters"
                  value={editData.numberOfSisters}
                  onFocus={(e) => e.target.value === '0' && (e.target.value = '')}
                  onChange={handleInputChange}
                  min="0"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Married Sisters</label>
                <input
                  type="number"
                  name="numberOfMarriedSisters"
                  value={editData.numberOfMarriedSisters}
                  onFocus={(e) => e.target.value === '0' && (e.target.value = '')}
                  onChange={handleInputChange}
                  min="0"
                  max={editData.numberOfSisters}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Family Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Family Details</label>
          <textarea
            name="familyDetails"
            rows={3}
            value={editData.familyDetails}
            onChange={handleInputChange}
            className={textareaClasses}
            placeholder="Tell us about additional family background..."
          />
        </div>
      </div>
    </div>
  );
}
