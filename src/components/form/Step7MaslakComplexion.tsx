'use client';

import { FormData } from './types';

interface Step7Props {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  getSelectClasses: (fieldName: string) => string;
  showCustomMaslak: boolean;
  setShowCustomMaslak: React.Dispatch<React.SetStateAction<boolean>>;
  customMaslak: string;
  setCustomMaslak: React.Dispatch<React.SetStateAction<string>>;
}

export default function Step7MaslakComplexion({ 
  formData, 
  handleInputChange,
  setFormData,
  getSelectClasses,
  showCustomMaslak,
  setShowCustomMaslak,
  customMaslak,
  setCustomMaslak
}: Step7Props) {
  return (
    <div>
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">🕌 Maslak & Appearance</h2>
          <p className="text-xs text-gray-600 mt-1">Religious sect and complexion</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Maslak (Religious Sect)</label>
          <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
            💡 Apna maslak select karein - Sunni (Hanafi, Deobandi, Barelvi), Shia, Sufi waghaira. Agar list mein nahi hai to "Other" select karein.
          </div>
          {!showCustomMaslak ? (
            <select
              name="maslak"
              value={formData.maslak}
              onChange={(e) => {
                if (e.target.value === 'Other') {
                  setShowCustomMaslak(true);
                } else {
                  handleInputChange(e);
                }
              }}
              className={getSelectClasses('maslak')}
            >
              <option value="">Select Maslak</option>
              
              {/* Sunni Maslak */}
              <optgroup label="Sunni Islam">
                <option value="Hanafi">Hanafi</option>
                <option value="Shafi'i">Shafi&apos;i</option>
                <option value="Maliki">Maliki</option>
                <option value="Hanbali">Hanbali</option>
                <option value="Ahle Hadith">Ahle Hadith (Salafi)</option>
                <option value="Deobandi">Deobandi</option>
                <option value="Barelvi">Barelvi</option>
                <option value="Jamaat-e-Islami">Jamaat-e-Islami</option>
              </optgroup>
              
              {/* Shia Maslak */}
              <optgroup label="Shia Islam">
                <option value="Twelver Shia">Twelver Shia (Ithna Ashariyya)</option>
                <option value="Ismaili">Ismaili</option>
                <option value="Zaidi">Zaidi</option>
                <option value="Alavi Bohra">Alavi Bohra</option>
                <option value="Dawoodi Bohra">Dawoodi Bohra</option>
              </optgroup>
              
              {/* Sufi Orders */}
              <optgroup label="Sufi Orders">
                <option value="Chishti">Chishti</option>
                <option value="Qadri">Qadri</option>
                <option value="Naqshbandi">Naqshbandi</option>
                <option value="Suhrawardi">Suhrawardi</option>
              </optgroup>
              
              {/* Other Islamic Sects */}
              <optgroup label="Other Islamic Sects">
                <option value="Ahmadiyya">Ahmadiyya</option>
                <option value="Quranist">Quranist</option>
                <option value="Non-denominational">Non-denominational Muslim</option>
              </optgroup>
              
              {/* Non-Muslim Options */}
              <optgroup label="Other Religions">
                <option value="Christian">Christian</option>
                <option value="Hindu">Hindu</option>
                <option value="Sikh">Sikh</option>
                <option value="Other Religion">Other Religion</option>
              </optgroup>
              <option value="Other">Other (Custom)</option>
            </select>
          ) : (
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your maslak"
                required
                value={customMaslak}
                onChange={(e) => {
                  const value = e.target.value;
                  setCustomMaslak(value);
                  setFormData({ ...formData, maslak: value });
                }}
                className="w-full px-3 py-2.5 pr-12 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 touch-manipulation font-light bg-white"
              />
              <button
                type="button"
                onClick={() => {
                  setShowCustomMaslak(false);
                  setCustomMaslak('');
                  setFormData({ ...formData, maslak: '' });
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600 hover:text-gray-800 bg-gray-100 px-2 py-1 rounded"
              >
                ↩️
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Complexion</label>
          <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
            💡 Rang/complexion select karein. Yeh optional hai - agar batana nahi chahte to "Prefer Not to Say" select karein.
          </div>
          <select
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            className={getSelectClasses('color')}
          >
            <option value="Prefer Not to Say">🤐 Prefer Not to Say / Batana Nahi</option>
            <option value="Fair">Fair / Gora</option>
            <option value="Very Fair">Very Fair / Bahut Gora</option>
            <option value="Medium">Medium / Gandum</option>
            <option value="Wheatish">Wheatish / Sanwla</option>
            <option value="Dark">Dark / Saaf Rang</option>
          </select>
        </div>
      </div>
    </div>
  );
}
