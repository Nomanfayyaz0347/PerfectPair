'use client';

import { FormData } from './types';

interface Step5Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  validationErrors: Record<string, string>;
  selectClasses: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  showCustomMotherTongue: boolean;
  setShowCustomMotherTongue: (value: boolean) => void;
  customMotherTongue: string;
  setCustomMotherTongue: (value: string) => void;
  showCustomBelongs: boolean;
  setShowCustomBelongs: (value: boolean) => void;
  customBelongs: string;
  setCustomBelongs: (value: string) => void;
}

export default function Step5LanguageOrigin({ 
  formData, 
  setFormData, 
  validationErrors, 
  selectClasses,
  handleInputChange,
  showCustomMotherTongue,
  setShowCustomMotherTongue,
  customMotherTongue,
  setCustomMotherTongue,
  showCustomBelongs,
  setShowCustomBelongs,
  customBelongs,
  setCustomBelongs
}: Step5Props) {
  return (
    <div>
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">🗣️ Language & Origin</h2>
          <p className="text-xs text-gray-600 mt-1">Mother tongue and belongs to</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mother Tongue <span className="text-red-500">*</span></label>
          <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
            💡 Apni madri zaban select karein - jaise Urdu, Punjabi, Sindhi waghaira. Agar list mein nahi hai to "Other" select karein.
          </div>
          {!showCustomMotherTongue ? (
            <select
              name="motherTongue"
              required
              value={formData.motherTongue}
              onChange={(e) => {
                if (e.target.value === 'Other') {
                  setShowCustomMotherTongue(true);
                } else {
                  handleInputChange(e);
                }
              }}
              className={selectClasses}
            >
              <option value="Urdu">Urdu</option>
              <option value="English">English</option>
              <option value="Punjabi">Punjabi</option>
              <option value="Sindhi">Sindhi</option>
              <option value="Pashto">Pashto</option>
              <option value="Balochi">Balochi</option>
              <option value="Saraiki">Saraiki</option>
              <option value="Hindko">Hindko</option>
              <option value="Kashmiri">Kashmiri</option>
              <option value="Arabic">Arabic</option>
              <option value="Persian">Persian</option>
              <option value="Turkish">Turkish</option>
              <option value="Other">Other (Custom)</option>
            </select>
          ) : (
            <div className="relative">
              <input
                type="text"
                placeholder="Enter mother tongue"
                required
                value={customMotherTongue}
                onChange={(e) => {
                  const value = e.target.value;
                  setCustomMotherTongue(value);
                  setFormData({ ...formData, motherTongue: value });
                }}
                className="w-full px-3 py-2.5 pr-12 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 touch-manipulation font-light bg-white"
              />
              <button
                type="button"
                onClick={() => {
                  setShowCustomMotherTongue(false);
                  setCustomMotherTongue('');
                  setFormData({ ...formData, motherTongue: 'Urdu' });
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600 hover:text-gray-800 bg-gray-100 px-2 py-1 rounded"
              >
                ↩️
              </button>
            </div>
          )}
          {validationErrors['motherTongue'] && (
            <p className="mt-1 text-xs text-red-600">
              {validationErrors['motherTongue']}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Belongs <span className="text-red-500">*</span></label>
          <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
            💡 Ap kis mulk/region se taluq rakhte hain - Pakistan, India, UK waghaira. Agar list mein nahi hai to "Other" select karein.
          </div>
          {!showCustomBelongs ? (
            <select
              name="belongs"
              required
              value={formData.belongs}
              onChange={(e) => {
                if (e.target.value === 'Other') {
                  setShowCustomBelongs(true);
                } else {
                  handleInputChange(e);
                }
              }}
              className={selectClasses}
            >
              <option value="Pakistan">Pakistan</option>
              <option value="Bangladesh">Bangladesh</option>
              <option value="India">India</option>
              <option value="Afghanistan">Afghanistan</option>
              <option value="Iran">Iran</option>
              <option value="Turkey">Turkey</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="UAE">UAE</option>
              <option value="UK">UK</option>
              <option value="USA">USA</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Other">Other (Custom)</option>
            </select>
          ) : (
            <div className="relative">
              <input
                type="text"
                placeholder="Enter country/region"
                required
                value={customBelongs}
                onChange={(e) => {
                  const value = e.target.value;
                  setCustomBelongs(value);
                  setFormData({ ...formData, belongs: value });
                }}
                className="w-full px-3 py-2.5 pr-12 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 touch-manipulation font-light bg-white"
              />
              <button
                type="button"
                onClick={() => {
                  setShowCustomBelongs(false);
                  setCustomBelongs('');
                  setFormData({ ...formData, belongs: 'Pakistan' });
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600 hover:text-gray-800 bg-gray-100 px-2 py-1 rounded"
              >
                ↩️
              </button>
            </div>
          )}
          {validationErrors['belongs'] && (
            <p className="mt-1 text-xs text-red-600">
              {validationErrors['belongs']}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
