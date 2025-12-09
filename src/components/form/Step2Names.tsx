'use client';

import { StepProps } from './types';

interface Step2Props extends StepProps {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  nameCheckLoading: boolean;
  nameAvailable: boolean | null;
  checkNameAvailability: (name: string, fatherName: string) => void;
}

export default function Step2Names({ 
  formData, 
  validationErrors, 
  getInputClasses,
  handleInputChange,
  nameCheckLoading,
  nameAvailable,
  checkNameAvailability
}: Step2Props) {
  return (
    <div>
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">📝 Personal Names</h2>
          <p className="text-xs text-gray-600 mt-1">Enter full name and father&apos;s name</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
          <div className="relative">
            <input
              type="text"
              name="name"
              required
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) => {
                handleInputChange(e);
                // Check name availability after a delay
                const value = e.target.value;
                if (value.length >= 3 && formData.fatherName) {
                  checkNameAvailability(value, formData.fatherName);
                }
              }}
              className={getInputClasses('name')}
            />
            {nameCheckLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500"></div>
              </div>
            )}
            {!nameCheckLoading && nameAvailable !== null && formData.name.length >= 3 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {nameAvailable ? (
                  <span className="text-green-500 text-sm">✓</span>
                ) : (
                  <span className="text-red-500 text-sm">✗</span>
                )}
              </div>
            )}
          </div>
          {validationErrors['name'] && (
            <p className="mt-1 text-xs text-red-600">
              {validationErrors['name']}
            </p>
          )}
          {!nameCheckLoading && nameAvailable === false && formData.name.length >= 3 && (
            <p className="mt-1 text-xs text-amber-600">
              A profile with similar name exists. You can still continue.
            </p>
          )}
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Father&apos;s Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="fatherName"
            required
            placeholder="Enter father's name"
            value={formData.fatherName}
            onChange={(e) => {
              handleInputChange(e);
              // Check name availability when father name changes
              const value = e.target.value;
              if (value.length >= 3 && formData.name.length >= 3) {
                checkNameAvailability(formData.name, value);
              }
            }}
            className={getInputClasses('fatherName')}
          />
          {validationErrors['fatherName'] && (
            <p className="mt-1 text-xs text-red-600">
              {validationErrors['fatherName']}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
