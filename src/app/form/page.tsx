'use client';

import { useState } from 'react';
import Link from 'next/link';

const locationOptions = [
  // Pakistan Cities
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
  
  // Bangladesh Cities  
  'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna',
  
  // India Cities
  'Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bangalore', 'Hyderabad',
  
  // International Cities
  'London', 'New York', 'Toronto', 'Sydney', 'Dubai', 'Riyadh',
  
  // Options
  'Same City', 'Any'
];

interface FormData {
  name: string;
  fatherName: string;
  gender: 'Male' | 'Female';
  age: number;
  height: string;
  weight: string;
  color: string;
  cast: string;
  maslak: string;
  maritalStatus: 'Single' | 'Divorced' | 'Widowed' | 'Separated';
  motherTongue: string;
  belongs: string;
  education: string;
  occupation: string;
  income: string;
  familyDetails: string;
  fatherAlive: boolean;
  motherAlive: boolean;
  numberOfBrothers: number;
  numberOfMarriedBrothers: number;
  numberOfSisters: number;
  numberOfMarriedSisters: number;
  houseType: 'Own House' | 'Rent' | 'Family House' | 'Apartment';
  country: string;
  city: string;
  contactNumber: string;
  photoUrl?: string;
  submittedBy: 'Main Admin' | 'Partner Matchmaker' | '';
  matchmakerName?: string;
  requirements: {
    ageRange: { min: number; max: number };
    heightRange: { min: string; max: string };
    education: string;
    occupation: string;
    familyType: string;
    location: string[];
    cast: string[];
    maslak: string[];
    maritalStatus: string[];
    motherTongue: string[];
    belongs: string[];
    houseType: string[];
  };
}

export default function FormPage() {
  // Improved input styling
  const inputClasses = "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 touch-manipulation font-light";
  const selectClasses = "w-full px-3 py-2.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 touch-manipulation font-light bg-white";
  const textareaClasses = "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 touch-manipulation font-light resize-none";
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    fatherName: '',
    gender: 'Male',
    age: 0,
    height: '',
    weight: '',
    color: '',
    cast: '',
    maslak: '',
    maritalStatus: 'Single',
    motherTongue: 'Urdu',
    belongs: 'Pakistan',
    education: '',
    occupation: '',
    income: '',
    familyDetails: '',
    houseType: 'Family House',
    country: 'Pakistan',
    city: 'Karachi',
    contactNumber: '',
    photoUrl: '',
    submittedBy: '',
    matchmakerName: '',
    fatherAlive: true,
    motherAlive: true,
    numberOfBrothers: 0,
    numberOfMarriedBrothers: 0,
    numberOfSisters: 0,
    numberOfMarriedSisters: 0,
    requirements: {
      ageRange: { min: 18, max: 35 },
      heightRange: { min: '5.0', max: '6.0' },
      education: '',
      occupation: '',
      familyType: '',
      location: [],
      cast: [],
      maslak: [],
      maritalStatus: [],
      motherTongue: [],
      belongs: [],
      houseType: []
    }
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    cast: false,
    maslak: false,
    maritalStatus: false,
    motherTongue: false,
    belongs: false,
    houseType: false,
    location: false
  });

  const toggleSection = (section: 'cast' | 'maslak' | 'maritalStatus' | 'motherTongue' | 'belongs' | 'houseType' | 'location') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('requirements.')) {
      const reqField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        requirements: {
          ...prev.requirements,
          [reqField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'age' ? parseInt(value) || 0 : value
      }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Photo size should be less than 5MB');
        return;
      }
      
      setSelectedPhoto(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const removePhoto = () => {
    setSelectedPhoto(null);
    setPhotoPreview(null);
  };

  const handleCheckboxChange = (fieldName: 'cast' | 'maslak' | 'maritalStatus' | 'motherTongue' | 'belongs' | 'houseType' | 'location', value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        [fieldName]: checked 
          ? [...prev.requirements[fieldName], value]
          : prev.requirements[fieldName].filter(item => item !== value)
      }
    }));
    
    // Auto close after selection (but not when removing)
    if (checked) {
      setTimeout(() => {
        setExpandedSections(prev => ({
          ...prev,
          [fieldName]: false
        }));
      }, 300); // Small delay for better UX
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let photoUrl = '';
      
      // Upload photo first if selected
      if (selectedPhoto) {
        setPhotoUploading(true);
        const photoFormData = new FormData();
        photoFormData.append('photo', selectedPhoto);
        
        const photoResponse = await fetch('/api/upload', {
          method: 'POST',
          body: photoFormData,
        });
        
        if (photoResponse.ok) {
          const photoData = await photoResponse.json();
          photoUrl = photoData.photoUrl;
          
          // Update formData with photoUrl
          setFormData(prev => ({
            ...prev,
            photoUrl: photoData.photoUrl
          }));
        } else {
          const errorData = await photoResponse.json();
          setError(errorData.error || 'Failed to upload photo');
          setPhotoUploading(false);
          setLoading(false);
          return;
        }
        setPhotoUploading(false);
      }

      // Submit profile with photo URL (use latest formData or photoUrl)
      const profileData = {
        ...formData,
        ...(photoUrl && { photoUrl })
      };

      // Submitting profile data

      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        // Clear match counts cache so fresh data loads on admin page
        localStorage.removeItem('profileMatchCounts');
        localStorage.removeItem('profileMatchCounts_timestamp');
        
        setSuccess(true);
        setFormData({
          name: '',
          fatherName: '',
          gender: 'Male',
          age: 0,
          height: '',
          weight: '',
          color: '',
          cast: '',
          maslak: '',
          maritalStatus: 'Single',
          motherTongue: 'Urdu',
          belongs: 'Pakistan',
          education: '',
          occupation: '',
          income: '',
          familyDetails: '',
          houseType: 'Family House',
          country: 'Pakistan',
          city: 'Karachi',
          contactNumber: '',
          photoUrl: '',
          submittedBy: '',
          fatherAlive: true,
          motherAlive: true,
          numberOfBrothers: 0,
          numberOfMarriedBrothers: 0,
          numberOfSisters: 0,
          numberOfMarriedSisters: 0,
          requirements: {
            ageRange: { min: 18, max: 35 },
            heightRange: { min: '5.0', max: '6.0' },
            education: '',
            occupation: '',
            familyType: '',
            location: [],
            cast: [],
            maslak: [],
            maritalStatus: [],
            motherTongue: [],
            belongs: [],
            houseType: []
          }
        });
        setSelectedPhoto(null);
        setPhotoPreview(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create profile');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl shadow-sm p-8 text-center">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-2xl text-gray-900 mb-4 heading">Profile Created Successfully!</h2>
          <p className="text-gray-600 mb-6 font-light">
            Thank you for creating your profile. Our team will review your information and contact you soon with potential matches.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => setSuccess(false)}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 px-4 rounded-lg transition-all font-light shadow-md hover:shadow-lg"
            >
              Create Another Profile
            </button>
            <Link
              href="/"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/50 py-4 sm:py-12 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto">
        {/* Mobile-First Header */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-flex items-right text-emerald-600 hover:text-emerald-500 mb-3 sm:mb-4 text-sm sm:text-base font-light tracking-wide">
            ← Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white text-lg">💕</span>
            </div>
            <h1 className="text-2xl sm:text-3xl text-gray-900 heading tracking-wide">PerfectPair</h1>
          </div>
          <h2 className="text-center text-xl sm:text-2xl text-gray-900 mb-2 heading">Create Your Profile</h2>
          <p className="text-center text-sm sm:text-base font-light text-gray-600  tracking-wide">Join thousands who found their perfect match</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-light">
              {error}
            </div>
          )}

          {/* Profile Submission Info */}
          <div>
            <h2 className="text-lg sm:text-xl text-gray-900 mb-4 heading">Profile Submission Details</h2>
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              
              {/* Who is submitting this profile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-blue-500">👤</span> Who is submitting this profile? *
                </label>
                <select
                  name="submittedBy"
                  required
                  value={formData.submittedBy}
                  onChange={handleInputChange}
                  className={selectClasses}
                >
                  <option value="">Select submitter type</option>
                  <option value="Main Admin">Main Admin (Direct Client)</option>
                  <option value="Partner Matchmaker">Partner Matchmaker (Sub-client)</option>
                </select>
              </div>

              {/* Matchmaker Name - Only show if Partner Matchmaker is selected */}
              {formData.submittedBy === 'Partner Matchmaker' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="text-green-500">🤝</span> Matchmaker Name *
                  </label>
                  <input
                    type="text"
                    name="matchmakerName"
                    required
                    placeholder="Enter matchmaker's name who referred this client"
                    value={formData.matchmakerName || ''}
                    onChange={handleInputChange}
                    className={inputClasses}
                  />
                </div>
              )}
              
            </div>
          </div>

          {/* Mobile-First Personal Information */}
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
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className={inputClasses}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Father&apos;s Name *</label>
                  <input
                    type="text"
                    name="fatherName"
                    required
                    value={formData.fatherName}
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
                    required
                    value={formData.gender}
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
                    required
                    value={formData.cast}
                    onChange={handleInputChange}
                    className={selectClasses}
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
                    
                    {/* Professional/Occupational */}
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
                      <option value="Other">Other</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Maslak (Religious Sect) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maslak (Religious Sect) *</label>
                <select
                  name="maslak"
                  required
                  value={formData.maslak}
                  onChange={handleInputChange}
                  className={selectClasses}
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
                </select>
              </div>

              {/* Marital Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status *</label>
                <select
                  name="maritalStatus"
                  required
                  value={formData.maritalStatus}
                  onChange={handleInputChange}
                  className={selectClasses}
                >
                  <option value="Single">Single</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mother Tongue *</label>
                  <select
                    name="motherTongue"
                    required
                    value={formData.motherTongue}
                    onChange={handleInputChange}
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
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Belongs *</label>
                  <select
                    name="belongs"
                    required
                    value={formData.belongs}
                    onChange={handleInputChange}
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
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                  <input
                    type="number"
                    name="age"
                    required
                    min="18"
                    max="80"
                    value={formData.age || ''}
                    onChange={handleInputChange}
                    className={inputClasses}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                  <input
                    type="text"
                    name="height"
                    placeholder="5.6 feet"
                    value={formData.height}
                    onChange={handleInputChange}
                    className={inputClasses}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                  <input
                    type="text"
                    name="weight"
                    placeholder="65 kg"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className={inputClasses}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Complexion</label>
                  <select
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className={selectClasses}
                  >
                    <option value="">Select</option>
                    <option value="Fair">Fair</option>
                    <option value="Medium">Medium</option>
                    <option value="Dark">Dark</option>
                  </select>
                </div>
              </div>

              {/* Photo Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
                  {photoPreview ? (
                    <div className="space-y-4">
                      <div className="relative inline-block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photoPreview}
                          alt="Profile preview"
                          className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full mx-auto border-4 border-emerald-200"
                        />
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">Photo selected successfully!</p>
                      <label className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 cursor-pointer transition-colors font-light">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handlePhotoChange}
                        />
                        Change Photo
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-4xl sm:text-6xl">📸</div>
                      <div>
                        <p className="text-sm sm:text-base text-gray-600 mb-2">Upload your profile photo</p>
                        <p className="text-xs text-gray-500 mb-4">Maximum size: 5MB | Formats: JPG, PNG, GIF</p>
                        <label className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg cursor-pointer transition-all touch-manipulation font-light shadow-md hover:shadow-lg">
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handlePhotoChange}
                          />
                          📷 Choose Photo
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h2 className="text-lg sm:text-xl text-gray-900 mb-4 heading">Professional Information</h2>
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Education *</label>
                <select
                  name="education"
                  required
                  value={formData.education}
                  onChange={handleInputChange}
                  className={selectClasses}
                >
                  <option value="">Select Education Level</option>
                  
                  {/* School Level */}
                  <optgroup label="School Education">
                    <option value="Matric">Matric (Class 10)</option>
                    <option value="Intermediate">Intermediate (Class 12)</option>
                    <option value="FSc">FSc (Pre-Medical/Pre-Engineering)</option>
                    <option value="FA">FA (Arts)</option>
                    <option value="ICS">ICS (Computer Science)</option>
                    <option value="A-Levels">A-Levels</option>
                  </optgroup>
                  
                  {/* Undergraduate */}
                  <optgroup label="Undergraduate">
                    <option value="Bachelor">Bachelor&apos;s Degree</option>
                    <option value="BBA">BBA (Business Administration)</option>
                    <option value="BCom">BCom (Commerce)</option>
                    <option value="BSc">BSc (Science)</option>
                    <option value="BA">BA (Arts)</option>
                    <option value="BE">BE (Engineering)</option>
                    <option value="MBBS">MBBS</option>
                    <option value="LLB">LLB (Law)</option>
                    <option value="BCS">BCS (Computer Science)</option>
                  </optgroup>
                  
                  {/* Graduate */}
                  <optgroup label="Graduate">
                    <option value="Master">Master&apos;s Degree</option>
                    <option value="MBA">MBA</option>
                    <option value="MSc">MSc</option>
                    <option value="MA">MA</option>
                    <option value="MS">MS (Engineering/Science)</option>
                    <option value="MCS">MCS (Computer Science)</option>
                  </optgroup>
                  
                  {/* Professional/Higher */}
                  <optgroup label="Professional & Higher">
                    <option value="PhD">PhD</option>
                    <option value="CA">CA (Chartered Accountant)</option>
                    <option value="CMA">CMA</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Certificate">Professional Certificate</option>
                  </optgroup>
                  
                  {/* Religious Education */}
                  <optgroup label="Religious Education">
                    <option value="Hafiz">Hafiz</option>
                    <option value="Qari">Qari</option>
                    <option value="Alim">Alim</option>
                    <option value="Fazil">Fazil</option>
                    <option value="Kamil">Kamil</option>
                    <option value="Dars-e-Nizami">Dars-e-Nizami</option>
                  </optgroup>
                  
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.gender === 'Male' ? 'Job/Business *' : 'Work/Occupation *'}
                </label>
                <select
                  name="occupation"
                  required
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className={selectClasses}
                >
                  <option value="">Select {formData.gender === 'Male' ? 'Job/Business' : 'Work/Occupation'}</option>
                  
                  {/* Professional Jobs (Both Genders) */}
                  <optgroup label="Professional Jobs">
                    <option value="Doctor">Doctor</option>
                    <option value="Engineer">Engineer</option>
                    <option value="Teacher/Professor">Teacher/Professor</option>
                    <option value="Lawyer">Lawyer</option>
                    <option value="Banker">Banker</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Pharmacist">Pharmacist</option>
                    <option value="Architect">Architect</option>
                    <option value="Software Developer">Software Developer</option>
                    <option value="Nurse">Nurse</option>
                  </optgroup>

                  {/* Business/Trade */}
                  <optgroup label="Business/Trade">
                    <option value="Business Owner">Business Owner</option>
                    <option value="Shopkeeper">Shopkeeper</option>
                    <option value="Trader">Trader</option>
                    <option value="Contractor">Contractor</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Import/Export">Import/Export</option>
                  </optgroup>

                  {/* Government Jobs */}
                  <optgroup label="Government Jobs">
                    <option value="Government Officer">Government Officer</option>
                    <option value="Police">Police</option>
                    <option value="Army">Army</option>
                    <option value="Civil Servant">Civil Servant</option>
                    <option value="Judge">Judge</option>
                  </optgroup>

                  {/* Service Sector */}
                  <optgroup label="Service Sector">
                    <option value="Manager">Manager</option>
                    <option value="Sales Executive">Sales Executive</option>
                    <option value="Customer Service">Customer Service</option>
                    <option value="HR Executive">HR Executive</option>
                    <option value="Marketing">Marketing</option>
                  </optgroup>

                  {/* Technical/Skilled */}
                  <optgroup label="Technical/Skilled Work">
                    <option value="Electrician">Electrician</option>
                    <option value="Mechanic">Mechanic</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Driver">Driver</option>
                    <option value="Technician">Technician</option>
                  </optgroup>

                  {/* Female-Specific Options */}
                  {formData.gender === 'Female' && (
                    <optgroup label="Home & Care">
                      <option value="Housewife">Housewife</option>
                      <option value="Home Tutor">Home Tutor</option>
                      <option value="Online Work">Online Work</option>
                      <option value="Part Time Job">Part Time Job</option>
                      <option value="Home Based Business">Home Based Business</option>
                      <option value="Freelancer">Freelancer</option>
                    </optgroup>
                  )}

                  {/* Other */}
                  <optgroup label="Other">
                    <option value="Student">Student</option>
                    <option value="Retired">Retired</option>
                    <option value="Unemployed">Unemployed</option>
                    <option value="Other">Other</option>
                  </optgroup>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.occupation === 'Student' ? 'Family Salary/Income (Monthly)' : 
                   formData.occupation === 'Housewife' ? 'Family Salary/Income (Monthly)' :
                   formData.occupation === 'Unemployed' ? 'Family Salary/Income (Monthly)' :
                   formData.gender === 'Female' && ['Home Tutor', 'Part Time Job', 'Online Work'].includes(formData.occupation) ? 'Salary/Income (Monthly)' :
                   'Monthly Salary/Income'}
                </label>
                <select
                  name="income"
                  value={formData.income}
                  onChange={handleInputChange}
                  className={selectClasses}
                >
                  <option value="">Select Salary Range</option>
                  
                  {/* For Students/Housewives/Unemployed - Family Income */}
                  {(['Student', 'Housewife', 'Unemployed'].includes(formData.occupation)) && (
                    <>
                      <optgroup label="Family Monthly Salary/Income">
                        <option value="20,000 - 30,000">Rs. 20,000 - 30,000 (Family Salary)</option>
                        <option value="30,000 - 50,000">Rs. 30,000 - 50,000 (Family Salary)</option>
                        <option value="50,000 - 75,000">Rs. 50,000 - 75,000 (Family Salary)</option>
                        <option value="75,000 - 1,00,000">Rs. 75,000 - 1,00,000 (Family Salary)</option>
                        <option value="1,00,000 - 1,50,000">Rs. 1,00,000 - 1,50,000 (Family Salary)</option>
                        <option value="1,50,000 - 2,00,000">Rs. 1,50,000 - 2,00,000 (Family Salary)</option>
                        <option value="2,00,000 - 3,00,000">Rs. 2,00,000 - 3,00,000 (Family Salary)</option>
                        <option value="3,00,000+">Rs. 3,00,000+ (Family Salary)</option>
                      </optgroup>
                    </>
                  )}
                  
                  {/* For Working People - Personal Income */}
                  {!(['Student', 'Housewife', 'Unemployed'].includes(formData.occupation)) && (
                    <>
                      {/* Entry Level Jobs */}
                      <optgroup label="Entry Level Salary">
                        <option value="15,000 - 25,000">Rs. 15,000 - 25,000 (Monthly Salary)</option>
                        <option value="25,000 - 35,000">Rs. 25,000 - 35,000 (Monthly Salary)</option>
                        <option value="35,000 - 45,000">Rs. 35,000 - 45,000 (Monthly Salary)</option>
                      </optgroup>
                      
                      {/* Mid Level */}
                      <optgroup label="Mid Level Salary">
                        <option value="45,000 - 60,000">Rs. 45,000 - 60,000 (Monthly Salary)</option>
                        <option value="60,000 - 80,000">Rs. 60,000 - 80,000 (Monthly Salary)</option>
                        <option value="80,000 - 1,00,000">Rs. 80,000 - 1,00,000 (Monthly Salary)</option>
                      </optgroup>
                      
                      {/* Senior Level */}
                      <optgroup label="Senior Level Salary">
                        <option value="1,00,000 - 1,50,000">Rs. 1,00,000 - 1,50,000 (Monthly Salary)</option>
                        <option value="1,50,000 - 2,00,000">Rs. 1,50,000 - 2,00,000 (Monthly Salary)</option>
                        <option value="2,00,000 - 3,00,000">Rs. 2,00,000 - 3,00,000 (Monthly Salary)</option>
                        <option value="3,00,000+">Rs. 3,00,000+ (Monthly Salary)</option>
                      </optgroup>
                    </>
                  )}
                  
                  {/* For Part Time/Home Based Work */}
                  {(['Home Tutor', 'Part Time Job', 'Online Work', 'Home Based Business', 'Freelancer'].includes(formData.occupation)) && (
                    <>
                      <optgroup label="Part Time Salary/Income">
                        <option value="5,000 - 10,000">Rs. 5,000 - 10,000 (Part Time Income)</option>
                        <option value="10,000 - 20,000">Rs. 10,000 - 20,000 (Part Time Income)</option>
                        <option value="20,000 - 30,000">Rs. 20,000 - 30,000 (Part Time Income)</option>
                        <option value="30,000+">Rs. 30,000+ (Part Time Income)</option>
                      </optgroup>
                    </>
                  )}
                  
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          {/* Family & Contact Information */}
          <div>
            <h2 className="text-lg sm:text-xl text-gray-900 mb-4 heading">Family & Contact Information</h2>
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Parents</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="fatherAlive"
                        checked={formData.fatherAlive}
                        onChange={(e) => setFormData({...formData, fatherAlive: e.target.checked})}
                        className="rounded border-gray-300 text-emerald-400 focus:ring-emerald-400/50"
                      />
                      <span className="ml-2 text-sm text-gray-600">Father (Living)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="motherAlive"
                        checked={formData.motherAlive}
                        onChange={(e) => setFormData({...formData, motherAlive: e.target.checked})}
                        className="rounded border-gray-300 text-emerald-400 focus:ring-emerald-400/50"
                      />
                      <span className="ml-2 text-sm text-gray-600">Mother (Living)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brothers</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Total Brothers</label>
                      <input
                        type="number"
                        name="numberOfBrothers"
                        value={formData.numberOfBrothers}
                        onChange={(e) => setFormData({...formData, numberOfBrothers: parseInt(e.target.value) || 0})}
                        min="0"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Married Brothers</label>
                      <input
                        type="number"
                        name="numberOfMarriedBrothers"
                        value={formData.numberOfMarriedBrothers}
                        onChange={(e) => setFormData({...formData, numberOfMarriedBrothers: parseInt(e.target.value) || 0})}
                        min="0"
                        max={formData.numberOfBrothers}
                        className={inputClasses}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sisters</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Total Sisters</label>
                      <input
                        type="number"
                        name="numberOfSisters"
                        value={formData.numberOfSisters}
                        onChange={(e) => setFormData({...formData, numberOfSisters: parseInt(e.target.value) || 0})}
                        min="0"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Married Sisters</label>
                      <input
                        type="number"
                        name="numberOfMarriedSisters"
                        value={formData.numberOfMarriedSisters}
                        onChange={(e) => setFormData({...formData, numberOfMarriedSisters: parseInt(e.target.value) || 0})}
                        min="0"
                        max={formData.numberOfSisters}
                        className={inputClasses}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Family Details</label>
                <textarea
                  name="familyDetails"
                  rows={3}
                  placeholder="Tell us about your family background..."
                  value={formData.familyDetails}
                  onChange={handleInputChange}
                  className={textareaClasses}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">House Type *</label>
                <select
                  name="houseType"
                  required
                  value={formData.houseType}
                  onChange={handleInputChange}
                  className={selectClasses}
                >
                  <option value="Family House">Family House</option>
                  <option value="Own House">Own House</option>
                  <option value="Rent">Rent</option>
                  <option value="Apartment">Apartment</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                  <select
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                    className={selectClasses}
                  >
                    <option value="Pakistan">Pakistan 🇵🇰</option>
                    <option value="Bangladesh">Bangladesh 🇧🇩</option>
                    <option value="India">India 🇮🇳</option>
                    <option value="Afghanistan">Afghanistan 🇦🇫</option>
                    <option value="Iran">Iran 🇮🇷</option>
                    <option value="Turkey">Turkey 🇹🇷</option>
                    <option value="Saudi Arabia">Saudi Arabia 🇸🇦</option>
                    <option value="UAE">UAE 🇦🇪</option>
                    <option value="UK">UK 🇬🇧</option>
                    <option value="USA">USA 🇺🇸</option>
                    <option value="Canada">Canada 🇨🇦</option>
                    <option value="Australia">Australia 🇦🇺</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <select
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className={selectClasses}
                  >
                    {/* Pakistan Cities */}
                    <optgroup label="Pakistan 🇵🇰">
                      <option value="Karachi">Karachi</option>
                      <option value="Lahore">Lahore</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Multan">Multan</option>
                      <option value="Peshawar">Peshawar</option>
                      <option value="Quetta">Quetta</option>
                      <option value="Sialkot">Sialkot</option>
                      <option value="Gujranwala">Gujranwala</option>
                    </optgroup>
                    
                    {/* Bangladesh Cities */}
                    <optgroup label="Bangladesh 🇧🇩">
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chittagong">Chittagong</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Khulna">Khulna</option>
                    </optgroup>
                    
                    {/* India Cities */}
                    <optgroup label="India 🇮🇳">
                      <option value="Delhi">Delhi</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Hyderabad">Hyderabad</option>
                    </optgroup>
                    
                    {/* International Cities */}
                    <optgroup label="International 🌍">
                      <option value="London">London</option>
                      <option value="New York">New York</option>
                      <option value="Toronto">Toronto</option>
                      <option value="Sydney">Sydney</option>
                      <option value="Dubai">Dubai</option>
                      <option value="Riyadh">Riyadh</option>
                    </optgroup>
                    
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
                <input
                  type="tel"
                  name="contactNumber"
                  required
                  placeholder="e.g., +92 300 1234567"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          {/* Partner Requirements */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-xl relative overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="px-4 sm:px-6 lg:px-8 py-6">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-pink-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-100 rounded-full translate-y-8 -translate-x-8 opacity-50"></div>
            
            {/* Header */}
            <div className="relative z-10 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">💕</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Partner Requirements</h2>
              </div>
              <p className="text-sm text-gray-600 ml-11">Tell us about your ideal life partner preferences</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:gap-6 relative z-10">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <span className="text-pink-500">🎂</span>
                  Preferred Age Range
                </label>
                <select
                  name="requirements.ageRange"
                  value={`${formData.requirements.ageRange.min}-${formData.requirements.ageRange.max}`}
                  onChange={(e) => {
                    const [min, max] = e.target.value.split('-').map(Number);
                    setFormData(prev => ({
                      ...prev,
                      requirements: {
                        ...prev.requirements,
                        ageRange: { min, max }
                      }
                    }));
                  }}
                  className={selectClasses}
                >
                  <option value="18-25">18 - 25 years</option>
                  <option value="20-25">20 - 25 years</option>
                  <option value="22-28">22 - 28 years</option>
                  <option value="25-30">25 - 30 years</option>
                  <option value="26-32">26 - 32 years</option>
                  <option value="28-35">28 - 35 years</option>
                  <option value="30-35">30 - 35 years</option>
                  <option value="30-40">30 - 40 years</option>
                  <option value="32-38">32 - 38 years</option>
                  <option value="35-40">35 - 40 years</option>
                  <option value="35-45">35 - 45 years</option>
                  <option value="40-45">40 - 45 years</option>
                  <option value="40-50">40 - 50 years</option>
                  <option value="45-50">45 - 50 years</option>
                  <option value="45-55">45 - 55 years</option>
                  <option value="50-60">50 - 60 years</option>
                  <option value="18-60">Any Age (18-60)</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <span className="text-pink-500">📏</span>
                  Preferred Height Range
                </label>
                <select
                  name="requirements.heightRange"
                  value={`${formData.requirements.heightRange.min}-${formData.requirements.heightRange.max}`}
                  onChange={(e) => {
                    const [min, max] = e.target.value.split('-');
                    setFormData(prev => ({
                      ...prev,
                      requirements: {
                        ...prev.requirements,
                        heightRange: { min, max }
                      }
                    }));
                  }}
                  className={selectClasses}
                >
                  <option value="4.5-5.2">4.5 - 5.2 feet (Short)</option>
                  <option value="4.8-5.4">4.8 - 5.4 feet</option>
                  <option value="5.0-5.6">5.0 - 5.6 feet (Average)</option>
                  <option value="5.2-5.8">5.2 - 5.8 feet</option>
                  <option value="5.4-6.0">5.4 - 6.0 feet (Tall)</option>
                  <option value="5.6-6.2">5.6 - 6.2 feet</option>
                  <option value="5.8-6.4">5.8 - 6.4 feet (Very Tall)</option>
                  <option value="4.0-5.0">4.0 - 5.0 feet</option>
                  <option value="5.0-5.5">5.0 - 5.5 feet</option>
                  <option value="5.5-6.0">5.5 - 6.0 feet</option>
                  <option value="6.0-6.5">6.0 - 6.5 feet</option>
                  <option value="4.5-6.5">Any Height (4.5-6.5 feet)</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <span className="text-blue-500">🎓</span>
                  Preferred Education Level
                </label>
                <select
                  name="requirements.education"
                  value={formData.requirements.education}
                  onChange={handleInputChange}
                  className={selectClasses}
                >
                  <option value="">Select Minimum Education</option>
                  <option value="Any Education">Any Education Level</option>
                  
                  {/* Minimum Requirements */}
                  <optgroup label="Minimum School Level">
                    <option value="Matric or above">Matric (Class 10) or above</option>
                    <option value="Intermediate or above">Intermediate (Class 12) or above</option>
                    <option value="FSc or above">FSc or above</option>
                  </optgroup>
                  
                  <optgroup label="Minimum Graduate Level">
                    <option value="Bachelor or above">Bachelor&apos;s Degree or above</option>
                    <option value="Graduate or above">Graduate or above</option>
                    <option value="Professional Degree">Professional Degree (MBBS/Engineering)</option>
                  </optgroup>
                  
                  <optgroup label="Minimum Master Level">
                    <option value="Master or above">Master&apos;s Degree or above</option>
                    <option value="MBA or above">MBA or above</option>
                    <option value="MS or above">MS/MSc or above</option>
                  </optgroup>
                  
                  <optgroup label="Professional Qualifications">
                    <option value="CA/CMA">CA/CMA Qualified</option>
                    <option value="Medical Professional">Medical Professional</option>
                    <option value="Engineer">Engineer</option>
                    <option value="PhD">PhD or equivalent</option>
                  </optgroup>
                  
                  <optgroup label="Religious Education">
                    <option value="Religious Education">Religious Education (Alim/Hafiz)</option>
                    <option value="Both Religious & Modern">Both Religious & Modern Education</option>
                  </optgroup>
                </select>
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <span className="text-green-500">💼</span>
                  Partner&apos;s Preferred Work/Job
                </label>
                <select
                  name="requirements.occupation"
                  value={formData.requirements.occupation}
                  onChange={handleInputChange}
                  className={selectClasses}
                >
                  <option value="">Select Preferred Occupation</option>
                  <option value="Any">Any Occupation</option>
                  
                  {/* Professional Jobs */}
                  <optgroup label="Professional Jobs">
                    <option value="Doctor">Doctor</option>
                    <option value="Engineer">Engineer</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Lawyer">Lawyer</option>
                    <option value="Banker">Banker</option>
                    <option value="Software Developer">Software Developer</option>
                    <option value="Government Officer">Government Officer</option>
                  </optgroup>

                  {/* Business */}
                  <optgroup label="Business">
                    <option value="Business Owner">Business Owner</option>
                    <option value="Trader">Trader</option>
                    <option value="Self Employed">Self Employed</option>
                  </optgroup>

                  {/* If looking for female partner */}
                  {formData.gender === 'Male' && (
                    <optgroup label="For Female Partner">
                      <option value="Working Woman">Working Woman</option>
                      <option value="Housewife">Housewife</option>
                      <option value="Home Based Work">Home Based Work</option>
                      <option value="Part Time Job">Part Time Job</option>
                    </optgroup>
                  )}

                  {/* If looking for male partner */}
                  {formData.gender === 'Female' && (
                    <optgroup label="For Male Partner">
                      <option value="Good Job">Good Job</option>
                      <option value="Government Job">Government Job</option>
                      <option value="Business">Business</option>
                      <option value="Professional">Professional</option>
                    </optgroup>
                  )}
                </select>
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <span className="text-orange-500">🏠</span>
                  Preferred Family Type
                </label>
                <select
                  name="requirements.familyType"
                  value={formData.requirements.familyType}
                  onChange={handleInputChange}
                  className={selectClasses}
                >
                  <option value="">Select family type</option>
                  <option value="Joint">Joint Family</option>
                  <option value="Nuclear">Nuclear Family</option>
                  <option value="Any">Any</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Location</label>
                
                {/* Clickable Input Display */}
                <div
                  onClick={() => toggleSection('location')}
                  className={`${inputClasses} cursor-pointer flex justify-between items-center min-h-[42px]`}
                >
                  <div className="flex flex-wrap gap-1">
                    {formData.requirements.location.length > 0 ? (
                      formData.requirements.location.map((loc, index) => (
                        <span key={index} className="bg-rose-100 text-rose-800 px-2 py-1 rounded-md text-sm">
                          {loc}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">Select preferred locations...</span>
                    )}
                  </div>
                  <span className="text-gray-400">
                    {expandedSections.location ? '▲' : '▼'}
                  </span>
                </div>

                {expandedSections.location && (
                  <div className="mt-2 border border-gray-300 rounded-lg p-3 bg-gray-50 max-h-48 overflow-y-auto">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Selected: {formData.requirements.location.length}</span>
                      {formData.requirements.location.length > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            formData.requirements.location.forEach(loc => {
                              handleCheckboxChange('location', loc, false);
                            });
                          }}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-1">
                      {locationOptions.map(location => (
                        <label key={location} className="flex items-center space-x-2 p-1 hover:bg-white rounded">
                          <input
                            type="checkbox"
                            checked={formData.requirements.location.includes(location)}
                            onChange={(e) => handleCheckboxChange('location', location, e.target.checked)}
                            className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                          />
                          <span className="text-sm text-gray-700">{location}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Cast</label>
                
                {/* Clickable Input Display */}
                <div 
                  className="mb-2 min-h-[40px] p-3 border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-emerald-300 transition-colors"
                  onClick={() => toggleSection('cast')}
                >
                  {formData.requirements.cast.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {formData.requirements.cast.map(cast => (
                        <span key={cast} className="inline-flex items-center px-2 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-md">
                          {cast}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCheckboxChange('cast', cast, false);
                            }}
                            className="ml-1 text-emerald-600 hover:text-emerald-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <span className="text-xs text-gray-500 ml-2 self-center">Click to add more</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Click to select preferred casts</span>
                  )}
                </div>

                {expandedSections.cast && (
                  <div className="space-y-3 max-h-48 overflow-y-auto p-3 border border-gray-200 rounded-lg bg-gray-50">
                    {/* Major Casts */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 text-sm">Major Casts</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {['Rajput', 'Jat', 'Gujjar', 'Awan', 'Arain', 'Sheikh', 'Malik', 'Chaudhary'].map(cast => (
                          <label key={cast} className="flex items-center text-sm">
                            <input
                              type="checkbox"
                              checked={formData.requirements.cast.includes(cast)}
                              onChange={(e) => handleCheckboxChange('cast', cast, e.target.checked)}
                              className="mr-2 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            {cast}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Religious/Tribal */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 text-sm">Religious/Tribal</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {['Syed', 'Qureshi', 'Ansari', 'Mughal', 'Pathan', 'Baloch'].map(cast => (
                          <label key={cast} className="flex items-center text-sm">
                            <input
                              type="checkbox"
                              checked={formData.requirements.cast.includes(cast)}
                              onChange={(e) => handleCheckboxChange('cast', cast, e.target.checked)}
                              className="mr-2 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            {cast}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Professional */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 text-sm">Professional</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {['Butt', 'Dar', 'Lone', 'Khan', 'Khatri'].map(cast => (
                          <label key={cast} className="flex items-center text-sm">
                            <input
                              type="checkbox"
                              checked={formData.requirements.cast.includes(cast)}
                              onChange={(e) => handleCheckboxChange('cast', cast, e.target.checked)}
                              className="mr-2 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            {cast}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Others */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 text-sm">Others</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {['Kashmiri', 'Punjabi', 'Sindhi'].map(cast => (
                          <label key={cast} className="flex items-center text-sm">
                            <input
                              type="checkbox"
                              checked={formData.requirements.cast.includes(cast)}
                              onChange={(e) => handleCheckboxChange('cast', cast, e.target.checked)}
                              className="mr-2 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            {cast}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Special Options */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 text-sm">Special Options</h4>
                      <div className="space-y-1">
                        <label className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={formData.requirements.cast.includes('Same Cast')}
                            onChange={(e) => handleCheckboxChange('cast', 'Same Cast', e.target.checked)}
                            className="mr-2 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          Same as Mine
                        </label>
                        <label className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={formData.requirements.cast.includes('Any')}
                            onChange={(e) => handleCheckboxChange('cast', 'Any', e.target.checked)}
                            className="mr-2 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          Any Cast
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Maslak</label>
                
                {/* Clickable Input Display */}
                <div 
                  className="mb-2 min-h-[40px] p-3 border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-blue-300 transition-colors"
                  onClick={() => toggleSection('maslak')}
                >
                  {formData.requirements.maslak.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {formData.requirements.maslak.map(maslak => (
                        <span key={maslak} className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md">
                          {maslak}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCheckboxChange('maslak', maslak, false);
                            }}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <span className="text-xs text-gray-500 ml-2 self-center">Click to add more</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Click to select preferred maslak</span>
                  )}
                </div>

                {expandedSections.maslak && (
                  <div className="space-y-3 max-h-56 overflow-y-auto p-3 border border-gray-200 rounded-lg bg-gray-50">
                    {/* Sunni Islam */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 text-sm">Sunni Islam</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {['Hanafi', 'Shafi\'i', 'Maliki', 'Hanbali', 'Ahle Hadith', 'Deobandi', 'Barelvi', 'Jamaat-e-Islami'].map(maslak => (
                          <label key={maslak} className="flex items-center text-sm">
                            <input
                              type="checkbox"
                              checked={formData.requirements.maslak.includes(maslak)}
                              onChange={(e) => handleCheckboxChange('maslak', maslak, e.target.checked)}
                              className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            {maslak === 'Shafi\'i' ? 'Shafi\'i' : maslak}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Shia Islam */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 text-sm">Shia Islam</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {['Twelver Shia', 'Ismaili', 'Zaidi', 'Alavi Bohra', 'Dawoodi Bohra'].map(maslak => (
                          <label key={maslak} className="flex items-center text-sm">
                            <input
                              type="checkbox"
                              checked={formData.requirements.maslak.includes(maslak)}
                              onChange={(e) => handleCheckboxChange('maslak', maslak, e.target.checked)}
                              className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            {maslak}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Sufi Orders */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 text-sm">Sufi Orders</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {['Chishti', 'Qadri', 'Naqshbandi', 'Suhrawardi'].map(maslak => (
                          <label key={maslak} className="flex items-center text-sm">
                            <input
                              type="checkbox"
                              checked={formData.requirements.maslak.includes(maslak)}
                              onChange={(e) => handleCheckboxChange('maslak', maslak, e.target.checked)}
                              className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            {maslak}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Other Islamic Sects */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 text-sm">Other Islamic Sects</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {['Ahmadiyya', 'Quranist', 'Non-denominational'].map(maslak => (
                          <label key={maslak} className="flex items-center text-sm">
                            <input
                              type="checkbox"
                              checked={formData.requirements.maslak.includes(maslak)}
                              onChange={(e) => handleCheckboxChange('maslak', maslak, e.target.checked)}
                              className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            {maslak}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Other Religions */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 text-sm">Other Religions</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {['Christian', 'Hindu', 'Sikh', 'Other Religion'].map(maslak => (
                          <label key={maslak} className="flex items-center text-sm">
                            <input
                              type="checkbox"
                              checked={formData.requirements.maslak.includes(maslak)}
                              onChange={(e) => handleCheckboxChange('maslak', maslak, e.target.checked)}
                              className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            {maslak}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Special Options */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 text-sm">Special Options</h4>
                      <div className="space-y-1">
                        <label className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={formData.requirements.maslak.includes('Same Maslak')}
                            onChange={(e) => handleCheckboxChange('maslak', 'Same Maslak', e.target.checked)}
                            className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          Same as Mine
                        </label>
                        <label className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={formData.requirements.maslak.includes('Any')}
                            onChange={(e) => handleCheckboxChange('maslak', 'Any', e.target.checked)}
                            className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          Any Maslak
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred House Type</label>
                
                {/* Clickable Input Display */}
                <div 
                  className="mb-2 min-h-[40px] p-3 border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-purple-300 transition-colors"
                  onClick={() => toggleSection('houseType')}
                >
                  {formData.requirements.houseType.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {formData.requirements.houseType.map(houseType => (
                        <span key={houseType} className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-md">
                          {houseType}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCheckboxChange('houseType', houseType, false);
                            }}
                            className="ml-1 text-purple-600 hover:text-purple-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <span className="text-xs text-gray-500 ml-2 self-center">Click to add more</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Click to select preferred house types</span>
                  )}
                </div>

                {expandedSections.houseType && (
                  <div className="space-y-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="grid grid-cols-2 gap-2">
                      {['Own House', 'Family House', 'Rent', 'Apartment'].map(houseType => (
                        <label key={houseType} className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={formData.requirements.houseType.includes(houseType)}
                            onChange={(e) => handleCheckboxChange('houseType', houseType, e.target.checked)}
                            className="mr-2 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          {houseType}
                        </label>
                      ))}
                    </div>
                    <div>
                      <label className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={formData.requirements.houseType.includes('Any')}
                          onChange={(e) => handleCheckboxChange('houseType', 'Any', e.target.checked)}
                          className="mr-2 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        Any House Type
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Marital Status</label>
                
                {/* Clickable Input Display */}
                <div 
                  className="mb-2 min-h-[40px] p-3 border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-orange-300 transition-colors"
                  onClick={() => toggleSection('maritalStatus')}
                >
                  {formData.requirements.maritalStatus.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {formData.requirements.maritalStatus.map(status => (
                        <span key={status} className="inline-flex items-center px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-md">
                          {status}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCheckboxChange('maritalStatus', status, false);
                            }}
                            className="ml-1 text-orange-600 hover:text-orange-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <span className="text-xs text-gray-500 ml-2 self-center">Click to add more</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Click to select preferred marital status</span>
                  )}
                </div>

                {expandedSections.maritalStatus && (
                  <div className="space-y-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="grid grid-cols-2 gap-2">
                      {['Single', 'Divorced', 'Widowed', 'Separated'].map(status => (
                        <label key={status} className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={formData.requirements.maritalStatus.includes(status)}
                            onChange={(e) => handleCheckboxChange('maritalStatus', status, e.target.checked)}
                            className="mr-2 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                          />
                          {status}
                        </label>
                      ))}
                    </div>
                    <div>
                      <label className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={formData.requirements.maritalStatus.includes('Any')}
                          onChange={(e) => handleCheckboxChange('maritalStatus', 'Any', e.target.checked)}
                          className="mr-2 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        Any Status
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Mother Tongue</label>
                
                {/* Clickable Input Display */}
                <div 
                  className="mb-2 min-h-[40px] p-3 border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-green-300 transition-colors"
                  onClick={() => toggleSection('motherTongue')}
                >
                  {formData.requirements.motherTongue.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {formData.requirements.motherTongue.map(language => (
                        <span key={language} className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded-md">
                          {language}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCheckboxChange('motherTongue', language, false);
                            }}
                            className="ml-1 text-green-600 hover:text-green-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <span className="text-xs text-gray-500 ml-2 self-center">Click to add more</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Click to select preferred mother tongue</span>
                  )}
                </div>

                {expandedSections.motherTongue && (
                  <div className="space-y-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="grid grid-cols-2 gap-2">
                      {['Urdu', 'English', 'Punjabi', 'Sindhi', 'Pashto', 'Balochi', 'Saraiki', 'Hindko', 'Kashmiri', 'Arabic', 'Persian', 'Turkish'].map(language => (
                        <label key={language} className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={formData.requirements.motherTongue.includes(language)}
                            onChange={(e) => handleCheckboxChange('motherTongue', language, e.target.checked)}
                            className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          {language}
                        </label>
                      ))}
                    </div>
                    <div>
                      <label className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={formData.requirements.motherTongue.includes('Any')}
                          onChange={(e) => handleCheckboxChange('motherTongue', 'Any', e.target.checked)}
                          className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        Any Language
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Nationality</label>
                
                {/* Clickable Input Display */}
                <div 
                  className="mb-2 min-h-[40px] p-3 border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-teal-300 transition-colors"
                  onClick={() => toggleSection('belongs')}
                >
                  {formData.requirements.belongs.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {formData.requirements.belongs.map(country => (
                        <span key={country} className="inline-flex items-center px-2 py-1 text-xs bg-teal-100 text-teal-800 rounded-md">
                          {country}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCheckboxChange('belongs', country, false);
                            }}
                            className="ml-1 text-teal-600 hover:text-teal-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <span className="text-xs text-gray-500 ml-2 self-center">Click to add more</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Click to select preferred nationality</span>
                  )}
                </div>

                {expandedSections.belongs && (
                  <div className="space-y-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="grid grid-cols-2 gap-2">
                      {['Pakistan', 'Bangladesh', 'India', 'Afghanistan', 'Iran', 'Turkey', 'Saudi Arabia', 'UAE', 'UK', 'USA', 'Canada', 'Australia'].map(country => (
                        <label key={country} className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={formData.requirements.belongs.includes(country)}
                            onChange={(e) => handleCheckboxChange('belongs', country, e.target.checked)}
                            className="mr-2 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                          />
                          {country}
                        </label>
                      ))}
                    </div>
                    <div>
                      <label className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={formData.requirements.belongs.includes('Any')}
                          onChange={(e) => handleCheckboxChange('belongs', 'Any', e.target.checked)}
                          className="mr-2 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                        />
                        Any Nationality
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Partner Requirements Section Footer */}
            <div className="mt-6 pt-4 border-t border-pink-200 relative z-10">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <span>✨</span>
                <span>These preferences will help us find your perfect match</span>
                <span>✨</span>
              </div>
            </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-4 sm:pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 sm:px-8 rounded-lg text-base sm:text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-light shadow-md hover:shadow-lg touch-manipulation"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {photoUploading ? 'Uploading Photo...' : 'Creating Profile...'}
                </div>
              ) : (
                'Create Profile 💕'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
