'use client';

import { FormData } from './types';

interface Step4Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  validationErrors: Record<string, string>;
  getSelectClasses: (fieldName: string) => string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  showCustomCast: boolean;
  setShowCustomCast: (value: boolean) => void;
  customCast: string;
  setCustomCast: (value: string) => void;
  showCustomMaritalStatus: boolean;
  setShowCustomMaritalStatus: (value: boolean) => void;
  customMaritalStatus: string;
  setCustomMaritalStatus: (value: string) => void;
}

export default function Step4CastMaritalStatus({ 
  formData, 
  setFormData, 
  validationErrors, 
  getSelectClasses,
  handleInputChange,
  showCustomCast,
  setShowCustomCast,
  customCast,
  setCustomCast,
  showCustomMaritalStatus,
  setShowCustomMaritalStatus,
  customMaritalStatus,
  setCustomMaritalStatus
}: Step4Props) {
  return (
    <div>
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">🏛️ Cast & Status</h2>
          <p className="text-xs text-gray-600 mt-1">Enter cast and marital status</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cast <span className="text-red-500">*</span></label>
          {!showCustomCast ? (
            <select
              name="cast"
              required
              value={formData.cast}
              onChange={(e) => {
                if (e.target.value === 'Other') {
                  setShowCustomCast(true);
                } else {
                  handleInputChange(e);
                }
              }}
              className={getSelectClasses('cast')}
            >
              <option value="">Select Cast</option>
              {/* Major Casts */}
              <optgroup label="Major Casts">
                <option value="Rajput">Rajput</option>
                <option value="Jat">Jat</option>
                <option value="Gujjar">Gujjar</option>
                <option value="Awan">Awan</option>
                <option value="Arain">Arain</option>
                <option value="Sheikh">Sheikh</option>
                <option value="Malik">Malik</option>
                <option value="Chaudhary">Chaudhary</option>
              </optgroup>
              
              {/* Religious/Tribal */}
              <optgroup label="Religious/Tribal">
                <option value="Syed">Syed</option>
                <option value="Qureshi">Qureshi</option>
                <option value="Ansari">Ansari</option>
                <option value="Mughal">Mughal</option>
                <option value="Pathan">Pathan</option>
                <option value="Baloch">Baloch</option>
              </optgroup>
              
              {/* Professional */}
              <optgroup label="Professional">
                <option value="Butt">Butt</option>
                <option value="Dar">Dar</option>
                <option value="Lone">Lone</option>
                <option value="Khan">Khan</option>
                <option value="Khatri">Khatri</option>
              </optgroup>
              
              {/* Others */}
              <optgroup label="Others">
                <option value="Kashmiri">Kashmiri</option>
                <option value="Punjabi">Punjabi</option>
                <option value="Sindhi">Sindhi</option>
                <option value="Other">Other (Custom)</option>
              </optgroup>
            </select>
          ) : (
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your cast"
                required
                value={customCast}
                onChange={(e) => {
                  const value = e.target.value;
                  setCustomCast(value);
                  setFormData({ ...formData, cast: value });
                }}
                className="w-full px-3 py-2.5 pr-12 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 touch-manipulation font-light bg-white"
              />
              <button
                type="button"
                onClick={() => {
                  setShowCustomCast(false);
                  setCustomCast('');
                  setFormData({ ...formData, cast: '' });
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600 hover:text-gray-800 bg-gray-100 px-2 py-1 rounded"
              >
                ↩️
              </button>
            </div>
          )}
          <p className="mt-1.5 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg leading-relaxed">
            💡 <strong>Hint:</strong> Apni zaat/biradari select karein. Agar list mein nahi to "Other" select karke likhein
          </p>
          {validationErrors['cast'] && (
            <p className="mt-1 text-xs text-red-600">
              {validationErrors['cast']}
            </p>
          )}
        </div>

        {/* Marital Status - Full Width */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status <span className="text-red-500">*</span></label>
          {!showCustomMaritalStatus ? (
            <select
              name="maritalStatus"
              required
              value={formData.maritalStatus}
              onChange={(e) => {
                if (e.target.value === 'Other') {
                  setShowCustomMaritalStatus(true);
                } else {
                  handleInputChange(e);
                }
              }}
              className={getSelectClasses('maritalStatus')}
            >
              <option value="Single">Single</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
              <option value="Separated">Separated</option>
              <option value="Other">Other (Custom)</option>
            </select>
          ) : (
            <div className="relative">
              <input
                type="text"
                placeholder="Enter marital status"
                required
                value={customMaritalStatus}
                onChange={(e) => {
                  const value = e.target.value;
                  setCustomMaritalStatus(value);
                  setFormData({ ...formData, maritalStatus: value });
                }}
                className="w-full px-3 py-2.5 pr-12 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 touch-manipulation font-light bg-white"
              />
              <button
                type="button"
                onClick={() => {
                  setShowCustomMaritalStatus(false);
                  setCustomMaritalStatus('');
                  setFormData({ ...formData, maritalStatus: 'Single' });
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600 hover:text-gray-800 bg-gray-100 px-2 py-1 rounded"
              >
                ↩️
              </button>
            </div>
          )}
          <p className="mt-1.5 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg leading-relaxed">
            💡 <strong>Hint:</strong> Shadi shuda halat batayein
            <span className="block mt-1">• <strong>Single</strong> - Abhi tak shadi nahi hui</span>
            <span className="block">• <strong>Divorced</strong> - Talaq ho chuki hai</span>
            <span className="block">• <strong>Widowed</strong> - Bewa/Beewa</span>
          </p>
          {validationErrors['maritalStatus'] && (
            <p className="mt-1 text-xs text-red-600">
              {validationErrors['maritalStatus']}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
