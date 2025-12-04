'use client';

import { Profile } from './types';

interface EditFormPersonalInfoProps {
  editData: Profile;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onImageClick: (imageUrl: string, imageName: string) => void;
  inputClasses: string;
  selectClasses: string;
}

export default function EditFormPersonalInfo({ 
  editData, 
  handleInputChange,
  onImageClick,
  inputClasses,
  selectClasses
}: EditFormPersonalInfoProps) {
  return (
    <div>
      <h2 className="text-lg sm:text-xl text-gray-900 mb-4 heading">Personal Information</h2>
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Name Fields - 50/50 Layout */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              name="name"
              value={editData.name}
              onChange={handleInputChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Father&apos;s Name *</label>
            <input
              type="text"
              name="fatherName"
              value={editData.fatherName}
              onChange={handleInputChange}
              className={inputClasses}
            />
          </div>
        </div>

        {/* Gender and Cast - 50/50 Layout */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
            <select
              name="gender"
              value={editData.gender || 'Male'}
              onChange={handleInputChange}
              className={selectClasses}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cast *</label>
            <select
              name="cast"
              value={editData.cast}
              onChange={handleInputChange}
              className={selectClasses}
            >
              <option value="">Select Cast</option>
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
              <optgroup label="Religious/Tribal">
                <option value="Syed">Syed</option>
                <option value="Qureshi">Qureshi</option>
                <option value="Ansari">Ansari</option>
                <option value="Mughal">Mughal</option>
                <option value="Pathan">Pathan</option>
                <option value="Baloch">Baloch</option>
              </optgroup>
              <optgroup label="Professional">
                <option value="Butt">Butt</option>
                <option value="Dar">Dar</option>
                <option value="Lone">Lone</option>
                <option value="Khan">Khan</option>
                <option value="Khatri">Khatri</option>
              </optgroup>
              <optgroup label="Others">
                <option value="Kashmiri">Kashmiri</option>
                <option value="Punjabi">Punjabi</option>
                <option value="Sindhi">Sindhi</option>
                <option value="Other">Other</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Age, Height, Weight - 3 Column Layout */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
            <input
              type="number"
              name="age"
              value={editData.age}
              onChange={handleInputChange}
              className={inputClasses}
              min="18"
              max="80"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
            <input
              type="text"
              name="height"
              value={editData.height}
              onChange={handleInputChange}
              placeholder="5.6"
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
            <input
              type="text"
              name="weight"
              value={editData.weight}
              onChange={handleInputChange}
              placeholder="70kg"
              className={inputClasses}
            />
          </div>
        </div>

        {/* Complexion */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Complexion</label>
          <select
            name="color"
            value={editData.color}
            onChange={handleInputChange}
            className={selectClasses}
          >
            <option value="">Select Complexion</option>
            <option value="Very Fair">Very Fair</option>
            <option value="Fair">Fair</option>
            <option value="Medium">Medium</option>
            <option value="Dark">Dark</option>
          </select>
        </div>

        {/* Maslak and Marital Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maslak (Religious Sect) *</label>
            <select
              name="maslak"
              value={editData.maslak || ''}
              onChange={handleInputChange}
              className={selectClasses}
            >
              <option value="">Select Maslak</option>
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
              <optgroup label="Shia Islam">
                <option value="Twelver Shia">Twelver Shia (Ithna Ashariyya)</option>
                <option value="Ismaili">Ismaili</option>
                <option value="Zaidi">Zaidi</option>
                <option value="Alavi Bohra">Alavi Bohra</option>
                <option value="Dawoodi Bohra">Dawoodi Bohra</option>
              </optgroup>
              <optgroup label="Sufi Orders">
                <option value="Chishti">Chishti</option>
                <option value="Qadri">Qadri</option>
                <option value="Naqshbandi">Naqshbandi</option>
                <option value="Suhrawardi">Suhrawardi</option>
              </optgroup>
              <optgroup label="Other Islamic Sects">
                <option value="Ahmadiyya">Ahmadiyya</option>
                <option value="Quranist">Quranist</option>
                <option value="Non-denominational">Non-denominational Muslim</option>
              </optgroup>
              <optgroup label="Other Religions">
                <option value="Christian">Christian</option>
                <option value="Hindu">Hindu</option>
                <option value="Sikh">Sikh</option>
                <option value="Other Religion">Other Religion</option>
              </optgroup>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status *</label>
            <select
              name="maritalStatus"
              value={editData.maritalStatus || 'Single'}
              onChange={handleInputChange}
              className={selectClasses}
            >
              <option value="Single">Single</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
              <option value="Separated">Separated</option>
            </select>
          </div>
        </div>

        {/* Mother Tongue and Nationality */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mother Tongue *</label>
            <select
              name="motherTongue"
              value={editData.motherTongue || ''}
              onChange={handleInputChange}
              className={selectClasses}
            >
              <option value="">Select Language</option>
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
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Belongs *</label>
            <select
              name="belongs"
              value={editData.belongs || ''}
              onChange={handleInputChange}
              className={selectClasses}
            >
              <option value="">Select Country</option>
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
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Photo Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
          {editData.photoUrl ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={editData.photoUrl}
                  alt="Profile preview"
                  className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full mx-auto border-4 border-emerald-200 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => onImageClick(editData.photoUrl!, editData.name)}
                  title="Click to view full image"
                />
              </div>
              <p className="text-sm text-gray-600">Current photo</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo URL</label>
                <input
                  type="url"
                  name="photoUrl"
                  value={editData.photoUrl || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com/photo.jpg"
                  className={inputClasses}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-4xl sm:text-6xl">📸</div>
              <div>
                <p className="text-sm sm:text-base text-gray-600 mb-2">No photo uploaded</p>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo URL</label>
                <input
                  type="url"
                  name="photoUrl"
                  value={editData.photoUrl || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com/photo.jpg"
                  className={inputClasses}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
