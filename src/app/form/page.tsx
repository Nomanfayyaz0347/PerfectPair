'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface FormData {
  name: string;
  fatherName: string;
  age: number;
  height: string;
  weight: string;
  color: string;
  education: string;
  occupation: string;
  income: string;
  familyDetails: string;
  address: string;
  contactNumber: string;
  photoUrl?: string;
  requirements: {
    ageRange: { min: number; max: number };
    heightRange: { min: string; max: string };
    education: string;
    occupation: string;
    familyType: string;
    location: string;
  };
}

export default function FormPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    fatherName: '',
    age: 0,
    height: '',
    weight: '',
    color: '',
    education: '',
    occupation: '',
    income: '',
    familyDetails: '',
    address: '',
    contactNumber: '',
    photoUrl: '',
    requirements: {
      ageRange: { min: 18, max: 35 },
      heightRange: { min: '5.0', max: '6.0' },
      education: '',
      occupation: '',
      familyType: '',
      location: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('requirements.')) {
      const reqField = name.split('.')[1];
      if (reqField === 'ageRange') {
        const [minMax, val] = value.split('-');
        setFormData(prev => ({
          ...prev,
          requirements: {
            ...prev.requirements,
            ageRange: {
              ...prev.requirements.ageRange,
              [minMax]: parseInt(val)
            }
          }
        }));
      } else if (reqField === 'heightRange') {
        const [minMax, val] = value.split('-');
        setFormData(prev => ({
          ...prev,
          requirements: {
            ...prev.requirements,
            heightRange: {
              ...prev.requirements.heightRange,
              [minMax]: val
            }
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          requirements: {
            ...prev.requirements,
            [reqField]: value
          }
        }));
      }
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

      console.log('Submitting profile data:', profileData);
      console.log('Photo URL:', photoUrl);

      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          fatherName: '',
          age: 0,
          height: '',
          weight: '',
          color: '',
          education: '',
          occupation: '',
          income: '',
          familyDetails: '',
          address: '',
          contactNumber: '',
          photoUrl: '',
          requirements: {
            ageRange: { min: 18, max: 35 },
            heightRange: { min: '5.0', max: '6.0' },
            education: '',
            occupation: '',
            familyType: '',
            location: ''
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
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Created Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for creating your profile. Our team will review your information and contact you soon with potential matches.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => setSuccess(false)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-4 sm:py-12 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto">
        {/* Mobile-First Header */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-500 mb-3 sm:mb-4 text-sm sm:text-base">
            ← Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">💕</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">PerfectPair</h1>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Create Your Profile</h2>
          <p className="text-sm sm:text-base text-gray-600 px-2">Join thousands who found their perfect match</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Mobile-First Personal Information */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 touch-manipulation"
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
                  className="w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 touch-manipulation"
                />
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
                    className="w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 touch-manipulation"
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
                    className="w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 touch-manipulation"
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
                    className="w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 touch-manipulation"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Complexion</label>
                  <select
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 touch-manipulation"
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
                          className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full mx-auto border-4 border-purple-200"
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
                      <label className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 cursor-pointer transition-colors">
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
                        <label className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-colors touch-manipulation">
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Education *</label>
                <input
                  type="text"
                  name="education"
                  required
                  placeholder="e.g., Bachelor's in Engineering"
                  value={formData.education}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Occupation *</label>
                <input
                  type="text"
                  name="occupation"
                  required
                  placeholder="e.g., Software Engineer"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Income</label>
                <input
                  type="text"
                  name="income"
                  placeholder="e.g., 50,000 PKR"
                  value={formData.income}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Family & Contact Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Family & Contact Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Family Details</label>
                <textarea
                  name="familyDetails"
                  rows={3}
                  placeholder="Tell us about your family background..."
                  value={formData.familyDetails}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <textarea
                  name="address"
                  required
                  rows={2}
                  placeholder="Your current address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Partner Requirements */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Partner Requirements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    min="18"
                    max="80"
                    value={formData.requirements.ageRange.min || ''}
                    onChange={(e) => handleInputChange({ target: { name: 'requirements.ageRange', value: `min-${e.target.value}` } } as React.ChangeEvent<HTMLInputElement>)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    min="18"
                    max="80"
                    value={formData.requirements.ageRange.max || ''}
                    onChange={(e) => handleInputChange({ target: { name: 'requirements.ageRange', value: `max-${e.target.value}` } } as React.ChangeEvent<HTMLInputElement>)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height Range</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Min (e.g., 5.0)"
                    value={formData.requirements.heightRange.min}
                    onChange={(e) => handleInputChange({ target: { name: 'requirements.heightRange', value: `min-${e.target.value}` } } as React.ChangeEvent<HTMLInputElement>)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  />
                  <input
                    type="text"
                    placeholder="Max (e.g., 6.0)"
                    value={formData.requirements.heightRange.max}
                    onChange={(e) => handleInputChange({ target: { name: 'requirements.heightRange', value: `max-${e.target.value}` } } as React.ChangeEvent<HTMLInputElement>)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Education</label>
                <input
                  type="text"
                  name="requirements.education"
                  placeholder="e.g., Graduate or above"
                  value={formData.requirements.education}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Occupation</label>
                <input
                  type="text"
                  name="requirements.occupation"
                  placeholder="e.g., Professional"
                  value={formData.requirements.occupation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Family Type</label>
                <select
                  name="requirements.familyType"
                  value={formData.requirements.familyType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select family type</option>
                  <option value="Joint">Joint Family</option>
                  <option value="Nuclear">Nuclear Family</option>
                  <option value="Any">Any</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Location</label>
                <input
                  type="text"
                  name="requirements.location"
                  placeholder="e.g., Karachi, Lahore"
                  value={formData.requirements.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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