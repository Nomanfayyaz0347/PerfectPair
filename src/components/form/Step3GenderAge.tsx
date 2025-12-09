'use client';

import { StepProps } from './types';

interface Step3Props extends StepProps {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function Step3GenderAge({ 
  formData, 
  validationErrors, 
  getSelectClasses,
  getInputClasses,
  handleInputChange 
}: Step3Props) {
  return (
    <div>
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">👤 Gender & Age</h2>
          <p className="text-xs text-gray-600 mt-1">Select gender and enter age</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender <span className="text-red-500">*</span></label>
          <select
            name="gender"
            required
            value={formData.gender}
            onChange={handleInputChange}
            className={getSelectClasses('gender')}
          >
            <option value="Male">👨 Male / Mard</option>
            <option value="Female">👩 Female / Aurat</option>
          </select>
          <p className="mt-1.5 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg leading-relaxed">
            💡 <strong>Hint:</strong> Jis ki profile bana rahe ho uski gender select karein
          </p>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Age <span className="text-red-500">*</span></label>
          <input
            type="number"
            name="age"
            required
            min="18"
            max="80"
            placeholder="Enter age (18-80)"
            value={formData.age}
            onChange={handleInputChange}
            className={getInputClasses('age')}
          />
          <p className="mt-1.5 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg leading-relaxed">
            💡 <strong>Hint:</strong> Umar 18 se 80 saal ke darmiyan honi chahiye
          </p>
          {validationErrors['age'] && (
            <p className="mt-1 text-xs text-red-600">
              {validationErrors['age']}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
