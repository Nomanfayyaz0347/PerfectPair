'use client';

import { StepProps } from './types';

interface Step1Props extends StepProps {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function Step1SubmitterType({ 
  formData, 
  setFormData, 
  validationErrors, 
  getSelectClasses,
  getInputClasses,
  handleInputChange 
}: Step1Props) {
  // Add this function if not already present
  // This should be called on form submit
  function debugSubmitter() {
    console.log('SubmittedBy value:', formData.submittedBy);
  }

  return (
    <div>
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">👤 Submitter Information</h2>
          <p className="text-xs text-gray-600 mt-1">Who is submitting this profile?</p>
        </div>
        
        {/* Who is submitting this profile */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="text-blue-500">👤</span> Submitter Type <span className="text-red-500">*</span>
          </label>
          <select
            name="submittedBy"
            required
            value={formData.submittedBy}
            onChange={e => {
              const value = e.target.value as '' | 'Main Admin' | 'Partner Matchmaker';
              setFormData(prev => ({ ...prev, submittedBy: value }));
              if (value === 'Main Admin') {
                setFormData(prev => ({ ...prev, matchmakerName: '' }));
              }
              console.log('DEBUG submittedBy:', value);
            }}
            className={getSelectClasses('submittedBy')}
          >
            <option value="">Select submitter type</option>
            <option value="Main Admin">👤 Client / Khud (Self)</option>
            <option value="Partner Matchmaker">🤝 Partner Matchmaker</option>
          </select>
          <p className="mt-1.5 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg leading-relaxed">
            💡 <strong>Hint:</strong> Ye profile kaun submit kar raha hai?
            <span className="block">• <strong>Partner Matchmaker</strong> - Koi aur matchmaker</span>
            <span className="block">• <strong>Main Admin</strong> - Aap khud admin hain</span>
          </p>
         
          {validationErrors['submittedBy'] && (
            <p className="mt-1 text-xs text-red-600">
              {validationErrors['submittedBy']}
            </p>
          )}
        </div>
        
        {formData.submittedBy === 'Partner Matchmaker' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Matchmaker Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="matchmakerName"
              placeholder="Enter matchmaker's name"
              value={formData.matchmakerName || ''}
              onChange={handleInputChange}
              className={getInputClasses('matchmakerName')}
            />
            <p className="mt-1 text-xs text-gray-500">Matchmaker ka naam likhein jo ye profile submit kar raha hai</p>
          </div>
        )}
      </div>
    </div>
  );
}
