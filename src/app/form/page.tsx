'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BottomNavigation from '@/components/BottomNavigation';

interface FormData {
  name: string;
  fatherName: string;
  gender: 'Male' | 'Female';
  age: number | '';
  height: string;
  weight: string;
  color: string;
  cast: string;
  maslak: string;
  maritalStatus: string;
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
  houseType: string;
  country: string;
  city: string;
  address?: string;
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
  // Helper function to get input classes with error state
  const getInputClasses = (fieldName: string) => {
    const hasError = validationErrors[fieldName];
    return `w-full px-3 py-2.5 text-xs border rounded-lg focus:outline-none focus:ring-1 transition-colors duration-200 touch-manipulation font-light ${
      hasError 
        ? 'border-red-500 focus:ring-red-400/50 focus:border-red-500' 
        : 'border-gray-300 focus:ring-emerald-400/50 focus:border-emerald-400'
    }`;
  };
  
  const getSelectClasses = (fieldName: string) => {
    const hasError = validationErrors[fieldName];
    return `w-full px-3 py-2.5 text-xs border rounded-lg focus:outline-none focus:ring-1 transition-colors duration-200 touch-manipulation font-light bg-white ${
      hasError 
        ? 'border-red-500 focus:ring-red-400/50 focus:border-red-500' 
        : 'border-gray-300 focus:ring-emerald-400/50 focus:border-emerald-400'
    }`;
  };
  
  const getTextareaClasses = (fieldName: string) => {
    const hasError = validationErrors[fieldName];
    return `w-full px-3 py-2.5 text-xs border rounded-lg focus:outline-none focus:ring-1 transition-colors duration-200 touch-manipulation font-light resize-none ${
      hasError 
        ? 'border-red-500 focus:ring-red-400/50 focus:border-red-500' 
        : 'border-gray-300 focus:ring-emerald-400/50 focus:border-emerald-400'
    }`;
  };
  
  // Legacy classes (kept for compatibility)
  const inputClasses = "w-full px-3 py-2.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 touch-manipulation font-light";
  const selectClasses = "w-full px-3 py-2.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 touch-manipulation font-light bg-white";
  const textareaClasses = "w-full px-3 py-2.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 touch-manipulation font-light resize-none";
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    fatherName: '',
    gender: 'Male',
    age: '',
    height: '5.0',
    weight: '50',
    color: 'Fair',
    cast: 'Syed',
    maslak: 'Hanafi',
    maritalStatus: 'Single',
    motherTongue: 'Urdu',
    belongs: 'Pakistan',
    education: 'Matric',
    occupation: 'Student',
    income: '',
    familyDetails: '',
    houseType: 'Family House',
    country: 'Pakistan',
    city: 'Karachi',
    address: '',
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

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [nameCheckLoading, setNameCheckLoading] = useState(false);
  const [nameAvailable, setNameAvailable] = useState<boolean | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [showCustomCast, setShowCustomCast] = useState(false);
  const [customCast, setCustomCast] = useState('');
  const [showCustomMaslak, setShowCustomMaslak] = useState(false);
  const [customMaslak, setCustomMaslak] = useState('');
  const [showCustomMaritalStatus, setShowCustomMaritalStatus] = useState(false);
  const [customMaritalStatus, setCustomMaritalStatus] = useState('');
  const [showCustomMotherTongue, setShowCustomMotherTongue] = useState(false);
  const [customMotherTongue, setCustomMotherTongue] = useState('');
  const [showCustomBelongs, setShowCustomBelongs] = useState(false);
  const [customBelongs, setCustomBelongs] = useState('');
  const [showCustomEducation, setShowCustomEducation] = useState(false);
  const [customEducation, setCustomEducation] = useState('');
  const [showCustomOccupation, setShowCustomOccupation] = useState(false);
  const [customOccupation, setCustomOccupation] = useState('');
  const [showCustomHouseType, setShowCustomHouseType] = useState(false);
  const [customHouseType, setCustomHouseType] = useState('');
  const [showCustomCountry, setShowCustomCountry] = useState(false);
  const [customCountry, setCustomCountry] = useState('');
  const [showCustomCity, setShowCustomCity] = useState(false);
  const [customCity, setCustomCity] = useState('');
  
  // Partner Requirements Custom Inputs
  const [customReqCast, setCustomReqCast] = useState('');
  const [customReqMaslak, setCustomReqMaslak] = useState('');
  const [customReqMaritalStatus, setCustomReqMaritalStatus] = useState('');
  const [customReqMotherTongue, setCustomReqMotherTongue] = useState('');
  const [customReqBelongs, setCustomReqBelongs] = useState('');
  const [customReqHouseType, setCustomReqHouseType] = useState('');
  const [customReqLocation, setCustomReqLocation] = useState('');
  const [customReqEducation, setCustomReqEducation] = useState('');
  const [customReqOccupation, setCustomReqOccupation] = useState('');
  const [customReqFamilyType, setCustomReqFamilyType] = useState('');
  const [showCustomReqEducation, setShowCustomReqEducation] = useState(false);
  const [showCustomReqOccupation, setShowCustomReqOccupation] = useState(false);
  const [showCustomReqFamilyType, setShowCustomReqFamilyType] = useState(false);
  const [showCustomReqAgeRange, setShowCustomReqAgeRange] = useState(false);
  const [customReqAgeMin, setCustomReqAgeMin] = useState('');
  const [customReqAgeMax, setCustomReqAgeMax] = useState('');
  const [showCustomReqHeightRange, setShowCustomReqHeightRange] = useState(false);
  const [customReqHeightMin, setCustomReqHeightMin] = useState('');
  const [customReqHeightMax, setCustomReqHeightMax] = useState('');
  
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

  // Auto-save form data to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('formDraft');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      } catch (e) {
        console.error('Error loading saved form data:', e);
      }
    }
  }, []);

  // Save form data whenever it changes
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('formDraft', JSON.stringify(formData));
    }, 1000); // Debounce for 1 second
    
    return () => clearTimeout(timer);
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
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
        [name]: name === 'age' ? (value === '' ? '' : parseInt(value)) : value
      }));
      
      // Check name availability when name or fatherName changes
      if (name === 'name' || name === 'fatherName') {
        // Only check if both name and father name have values
        if ((name === 'name' && value && formData.fatherName) || 
            (name === 'fatherName' && value && formData.name)) {
          checkNameAvailability(
            name === 'name' ? value : formData.name,
            name === 'fatherName' ? value : formData.fatherName
          );
        } else if (name === 'name' && !value) {
          setNameAvailable(null);
        }
      }
    }
  };

  const checkNameAvailability = async (name: string, fatherName: string) => {
    if (!name || !fatherName) return;
    
    setNameCheckLoading(true);
    setNameAvailable(null);
    
    try {
      const response = await fetch('/api/check-duplicates?name=' + encodeURIComponent(name));
      const data = await response.json();
      
      if (data.success && data.profiles && data.profiles.length > 0) {
        // Check if any profile has matching name AND father name
        const exactMatch = data.profiles.some((p: { name: string; fatherName?: string }) => 
          p.name.toLowerCase() === name.toLowerCase() && 
          p.fatherName?.toLowerCase() === fatherName.toLowerCase()
        );
        
        setNameAvailable(!exactMatch);
      } else {
        setNameAvailable(true);
      }
    } catch (error) {
      setNameAvailable(null);
    } finally {
      setNameCheckLoading(false);
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
    // Clear validation error for this field
    if (fieldName === 'cast' || fieldName === 'maritalStatus') {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
    
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

  // Multi-step navigation functions
  const validateCurrentStep = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (currentStep === 1) {
      // Step 1: Personal Information
      if (!formData.submittedBy) errors.submittedBy = 'Please select who is submitting';
      if (formData.submittedBy === 'Partner Matchmaker' && !formData.matchmakerName) {
        errors.matchmakerName = 'Matchmaker name is required';
      }
      if (!formData.name || formData.name.trim() === '') errors.name = 'Full name is required';
      if (!formData.fatherName || formData.fatherName.trim() === '') errors.fatherName = "Father's name is required";
      if (!formData.gender) errors.gender = 'Gender is required';
      if (!formData.cast || formData.cast.trim() === '') errors.cast = 'Cast is required';
      if (!formData.maritalStatus || formData.maritalStatus.trim() === '') errors.maritalStatus = 'Marital status is required';
      if (!formData.motherTongue || formData.motherTongue.trim() === '') errors.motherTongue = 'Mother tongue is required';
      if (!formData.belongs || formData.belongs.trim() === '') errors.belongs = 'Belongs is required';
      if (!formData.age || formData.age < 18 || formData.age > 80) errors.age = 'Valid age (18-80) is required';
      
      // Check if name is available
      if (nameAvailable === false) {
        errors.name = 'Profile already exists with this name and father name';
      }
    } else if (currentStep === 2) {
      // Step 2: Physical Details & Education
      if (!formData.education || formData.education.trim() === '') errors.education = 'Education is required';
      if (!formData.occupation || formData.occupation.trim() === '') errors.occupation = 'Job/Business is required';
    } else if (currentStep === 3) {
      // Step 3: Family & Contact
      if (!formData.houseType || formData.houseType.trim() === '') errors.houseType = 'House type is required';
      if (!formData.country || formData.country.trim() === '') errors.country = 'Country is required';
      if (!formData.city || formData.city.trim() === '') errors.city = 'City is required';
      if (!formData.address || formData.address.trim() === '') errors.address = 'Address is required';
      if (!formData.contactNumber || formData.contactNumber.trim() === '') errors.contactNumber = 'Contact number is required';
    } else if (currentStep === 4) {
      // Step 4: Partner Requirements
      if (!formData.requirements.ageRange.min || !formData.requirements.ageRange.max) {
        errors.ageRange = 'Preferred age range is required';
      }
      if (!formData.requirements.education || formData.requirements.education.trim() === '') {
        errors.education = 'Preferred education level is required';
      }
      if (!formData.requirements.cast || formData.requirements.cast.length === 0) {
        errors.cast = 'At least one preferred cast is required';
      }
      if (!formData.requirements.maritalStatus || formData.requirements.maritalStatus.length === 0) {
        errors.maritalStatus = 'At least one preferred marital status is required';
      }
    }
    
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }
    
    return true;
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setValidationErrors({}); // Clear errors when moving to next step
      // Auto-save on step change
      localStorage.setItem('formDraft', JSON.stringify(formData));
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only allow submission on Step 4
    if (currentStep < totalSteps) {
      return;
    }
    
    // Validate current step before submission
    if (!validateCurrentStep()) {
      return;
    }
    
    // Additional validation - check all required fields across all steps
    const allErrors: Record<string, string> = {};
    
    // Step 1 required fields
    if (!formData.submittedBy) allErrors.submittedBy = 'Required';
    if (formData.submittedBy === 'Partner Matchmaker' && !formData.matchmakerName) allErrors.matchmakerName = 'Required';
    if (!formData.name?.trim()) allErrors.name = 'Required';
    if (!formData.fatherName?.trim()) allErrors.fatherName = 'Required';
    if (!formData.gender) allErrors.gender = 'Required';
    if (!formData.cast?.trim()) allErrors.cast = 'Required';
    if (!formData.maritalStatus?.trim()) allErrors.maritalStatus = 'Required';
    if (!formData.motherTongue?.trim()) allErrors.motherTongue = 'Required';
    if (!formData.belongs?.trim()) allErrors.belongs = 'Required';
    if (!formData.age || formData.age < 18) allErrors.age = 'Required';
    
    // Step 2 required fields
    if (!formData.education?.trim()) allErrors.education = 'Required';
    if (!formData.occupation?.trim()) allErrors.occupation = 'Required';
    
    // Step 3 required fields
    if (!formData.houseType?.trim()) allErrors.houseType = 'Required';
    if (!formData.country?.trim()) allErrors.country = 'Required';
    if (!formData.city?.trim()) allErrors.city = 'Required';
    if (!formData.address?.trim()) allErrors.address = 'Required';
    if (!formData.contactNumber?.trim()) allErrors.contactNumber = 'Required';
    
    if (Object.keys(allErrors).length > 0) {
      setValidationErrors(allErrors);
      const missingFieldsList = Object.keys(allErrors).join(', ');
      setError(`❌ Please fill all required fields: ${missingFieldsList}`);
      
      // Go to first step with error
      if (allErrors.name || allErrors.fatherName || allErrors.gender || allErrors.cast || 
          allErrors.maritalStatus || allErrors.motherTongue || allErrors.belongs || allErrors.age || 
          allErrors.submittedBy) {
        setCurrentStep(1);
      } else if (allErrors.education || allErrors.occupation) {
        setCurrentStep(2);
      } else if (allErrors.houseType || allErrors.country || allErrors.city || 
                 allErrors.address || allErrors.contactNumber) {
        setCurrentStep(3);
      }
      
      window.scrollTo(0, 0);
      return;
    }
    
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
      const profileData: any = {
        ...formData,
        ...(photoUrl && { photoUrl })
      };
      
      // Remove empty optional fields that cause validation errors
      if (!profileData.matchmakerName) delete profileData.matchmakerName;
      if (!profileData.status) delete profileData.status;

      // Log the data being sent for debugging
      console.log('Submitting profile data:', profileData);

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
        // Clear saved draft after successful submission
        localStorage.removeItem('formDraft');
        
        setSuccess(true);
        setFormData({
          name: '',
          fatherName: '',
          gender: 'Male',
          age: '',
          height: '5.0',
          weight: '50',
          color: 'Fair',
          cast: 'Syed',
          maslak: 'Hanafi',
          maritalStatus: 'Single',
          motherTongue: 'Urdu',
          belongs: 'Pakistan',
          education: 'Matric',
          occupation: 'Student',
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
        console.log('API Error Response:', errorData);
        
        // Handle validation errors
        if (errorData.details && Array.isArray(errorData.details)) {
          const errors: Record<string, string> = {};
          const missingFields: string[] = [];
          
          errorData.details.forEach((err: { field: string; message: string }) => {
            errors[err.field] = err.message;
            
            // Get field label in Urdu/English for better understanding
            const fieldLabels: Record<string, string> = {
              name: 'Full Name',
              fatherName: "Father's Name",
              gender: 'Gender',
              age: 'Age',
              cast: 'Cast',
              maritalStatus: 'Marital Status',
              motherTongue: 'Mother Tongue',
              belongs: 'Belongs',
              education: 'Education',
              occupation: 'Job/Business',
              houseType: 'House Type',
              country: 'Country',
              city: 'City',
              address: 'Address',
              contactNumber: 'Contact Number',
              submittedBy: 'Who is submitting'
            };
            
            const fieldLabel = fieldLabels[err.field] || err.field;
            missingFields.push(fieldLabel);
            console.log(`Validation Error - ${err.field}: ${err.message}`);
          });
          
          setValidationErrors(errors);
          
          // Determine which step has the error
          const step1Fields = ['name', 'fatherName', 'gender', 'cast', 'maritalStatus', 'motherTongue', 'belongs', 'age', 'submittedBy', 'matchmakerName'];
          const step2Fields = ['education', 'occupation'];
          const step3Fields = ['houseType', 'country', 'city', 'address', 'contactNumber'];
          
          const errorFields = Object.keys(errors);
          let errorStep = currentStep;
          
          if (errorFields.some(field => step1Fields.includes(field))) {
            errorStep = 1;
          } else if (errorFields.some(field => step2Fields.includes(field))) {
            errorStep = 2;
          } else if (errorFields.some(field => step3Fields.includes(field))) {
            errorStep = 3;
          }
          
          // Move to the step with error
          if (errorStep !== currentStep) {
            setCurrentStep(errorStep);
          }
          
          // Create detailed error message with field names and step
          const errorMessage = `❌ Missing Fields in Step ${errorStep}: ${missingFields.join(', ')}`;
          setError(errorMessage);
          
          // Scroll to first error
          setTimeout(() => {
            const firstErrorField = document.querySelector('.border-red-500');
            if (firstErrorField) {
              firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
              window.scrollTo(0, 0);
            }
          }, 100);
        } else {
          setError(errorData.error || 'Failed to create profile. Please check all required fields.');
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
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
    <div className="min-h-screen bg-gradient-to-b from-teal-50/50 to-white flex flex-col">
      {/* Header */}
      <header className="px-5 pt-6 pb-4">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-200">
              <span className="text-xl">💕</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 tracking-tight">PerfectPair</h1>
              <p className="text-[10px] text-teal-600 font-medium -mt-0.5">Create Your Profile</p>
            </div>
          </div>
          <Link 
            href="/" 
            className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center active:scale-95 transition-all shadow-sm"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto px-5 pb-16">
        <div className="max-w-lg mx-auto">
          {/* Draft Status */}
          {typeof window !== 'undefined' && localStorage.getItem('formDraft') && (
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-700 flex items-center justify-between">
              <span>💾 Draft auto-saved! Your progress is secure.</span>
              <button
                onClick={() => {
                  if (confirm('Clear saved progress? This cannot be undone.')) {
                    localStorage.removeItem('formDraft');
                    window.location.reload();
                  }
                }}
                className="text-red-500 hover:text-red-700 font-medium underline"
              >
                Clear
              </button>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="mb-6 bg-white border border-teal-100 rounded-2xl shadow-sm p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-800">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm font-bold text-teal-600">{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-3 px-1">
              <div className={`flex-1 text-center ${currentStep === 1 ? 'text-teal-600 font-bold' : currentStep > 1 ? 'text-teal-500' : 'text-gray-400'}`}>
                <div className="text-[10px] font-medium">Personal</div>
              </div>
              <div className={`flex-1 text-center ${currentStep === 2 ? 'text-teal-600 font-bold' : currentStep > 2 ? 'text-teal-500' : 'text-gray-400'}`}>
                <div className="text-[10px] font-medium">Details</div>
              </div>
              <div className={`flex-1 text-center ${currentStep === 3 ? 'text-teal-600 font-bold' : currentStep > 3 ? 'text-teal-500' : 'text-gray-400'}`}>
                <div className="text-[10px] font-medium">Family</div>
              </div>
              <div className={`flex-1 text-center ${currentStep === 4 ? 'text-teal-600 font-bold' : 'text-gray-400'}`}>
                <div className="text-[10px] font-medium">Partner</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} onKeyDown={(e) => {
            if (e.key === 'Enter' && currentStep < 4) {
              e.preventDefault();
            }
          }} noValidate className="bg-white border border-teal-100 rounded-2xl shadow-sm p-5 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

          {/* STEP 1: Personal Information */}
          {currentStep === 1 && (
            <>
          {/* Personal Information */}
          <div>
            <div className="space-y-4">
              
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
                  className={getSelectClasses('submittedBy')}
                >
                  <option value="">Select submitter type</option>
                  <option value="Main Admin">Main Admin (Direct Client)</option>
                  <option value="Partner Matchmaker">Partner Matchmaker (Sub-client)</option>
                </select>
                {validationErrors['submittedBy'] && (
                  <p className="mt-1 text-xs text-red-600">
                    {validationErrors['submittedBy']}
                  </p>
                )}
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
              
              {/* Name Fields - 50/50 Layout */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className={getInputClasses('name')}
                    />
                    {nameCheckLoading && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin h-4 w-4 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                    {!nameCheckLoading && nameAvailable === true && formData.name && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                        ✓
                      </div>
                    )}
                    {!nameCheckLoading && nameAvailable === false && formData.name && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                        ✗
                      </div>
                    )}
                  </div>
                  {validationErrors['name'] && (
                    <p className="mt-1 text-xs text-red-600">
                      {validationErrors['name']}
                    </p>
                  )}
                  {!nameCheckLoading && nameAvailable === false && formData.name && !validationErrors['name'] && (
                    <p className="mt-1 text-xs text-red-600">
                      Profile already exists with this name
                    </p>
                  )}
                  {!nameCheckLoading && nameAvailable === true && formData.name && !validationErrors['name'] && (
                    <p className="mt-1 text-xs text-green-600">
                      Name is available
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Father&apos;s Name *</label>
                  <input
                    type="text"
                    name="fatherName"
                    required
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    className={getInputClasses('fatherName')}
                  />
                  {validationErrors['fatherName'] && (
                    <p className="mt-1 text-xs text-red-600">
                      {validationErrors['fatherName']}
                    </p>
                  )}
                </div>
              </div>

              {/* Gender and Cast - 50/50 Layout */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                  <select
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={getSelectClasses('gender')}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {validationErrors['gender'] && (
                    <p className="mt-1 text-xs text-red-600">
                      {validationErrors['gender']}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cast *</label>
                  {!showCustomCast ? (
                    <select
                      name="cast"
                      required
                      value={formData.cast}
                      onChange={(e) => {
                        if (e.target.value === 'Other') {
                          setShowCustomCast(true);
                          setFormData({ ...formData, cast: '' });
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
                  {validationErrors['cast'] && (
                    <p className="mt-1 text-xs text-red-600">
                      {validationErrors['cast']}
                    </p>
                  )}
                </div>
              </div>

              {/* Marital Status and Age - 50/50 Layout */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status *</label>
                  {!showCustomMaritalStatus ? (
                    <select
                      name="maritalStatus"
                      required
                      value={formData.maritalStatus}
                      onChange={(e) => {
                        if (e.target.value === 'Other') {
                          setShowCustomMaritalStatus(true);
                          setFormData({ ...formData, maritalStatus: '' });
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
                </div>

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
                    className={getInputClasses('age')}
                  />
                  {validationErrors['age'] && (
                    <p className="mt-1 text-xs text-red-600">
                      {validationErrors['age']}
                    </p>
                  )}
                </div>
              </div>

              {/* Mother Tongue and Belongs - 50/50 Layout */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mother Tongue *</label>
                  {!showCustomMotherTongue ? (
                    <select
                      name="motherTongue"
                      required
                      value={formData.motherTongue}
                      onChange={(e) => {
                        if (e.target.value === 'Other') {
                          setShowCustomMotherTongue(true);
                          setFormData({ ...formData, motherTongue: '' });
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Belongs *</label>
                  {!showCustomBelongs ? (
                    <select
                      name="belongs"
                      required
                      value={formData.belongs}
                      onChange={(e) => {
                        if (e.target.value === 'Other') {
                          setShowCustomBelongs(true);
                          setFormData({ ...formData, belongs: '' });
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
                </div>
              </div>
              
            </div>
          </div>
            </>
          )}

          {/* STEP 2: Physical Details, Maslak, Education & Photo */}
          {currentStep === 2 && (
            <>
          {/* Physical Details Section */}
          <div>
            <div className="space-y-4">
              {/* Height & Weight - 50/50 Layout */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                  <select
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    className={getSelectClasses('height')}
                  >
                    <option value="4.0">4&apos;0&quot;</option>
                    <option value="4.1">4&apos;1&quot;</option>
                    <option value="4.2">4&apos;2&quot;</option>
                    <option value="4.3">4&apos;3&quot;</option>
                    <option value="4.4">4&apos;4&quot;</option>
                    <option value="4.5">4&apos;5&quot;</option>
                    <option value="4.6">4&apos;6&quot;</option>
                    <option value="4.7">4&apos;7&quot;</option>
                    <option value="4.8">4&apos;8&quot;</option>
                    <option value="4.9">4&apos;9&quot;</option>
                    <option value="4.10">4&apos;10&quot;</option>
                    <option value="4.11">4&apos;11&quot;</option>
                    <option value="5.0">5&apos;0&quot;</option>
                    <option value="5.1">5&apos;1&quot;</option>
                    <option value="5.2">5&apos;2&quot;</option>
                    <option value="5.3">5&apos;3&quot;</option>
                    <option value="5.4">5&apos;4&quot;</option>
                    <option value="5.5">5&apos;5&quot;</option>
                    <option value="5.6">5&apos;6&quot;</option>
                    <option value="5.7">5&apos;7&quot;</option>
                    <option value="5.8">5&apos;8&quot;</option>
                    <option value="5.9">5&apos;9&quot;</option>
                    <option value="5.10">5&apos;10&quot;</option>
                    <option value="5.11">5&apos;11&quot;</option>
                    <option value="6.0">6&apos;0&quot;</option>
                    <option value="6.1">6&apos;1&quot;</option>
                    <option value="6.2">6&apos;2&quot;</option>
                    <option value="6.3">6&apos;3&quot;</option>
                    <option value="6.4">6&apos;4&quot;</option>
                    <option value="6.5">6&apos;5&quot;</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    min="30"
                    max="200"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className={getInputClasses('weight')}
                  />
                </div>
              </div>

              {/* Maslak and Complexion - 50/50 Layout */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maslak (Religious Sect)</label>
                  {!showCustomMaslak ? (
                    <select
                      name="maslak"
                      value={formData.maslak}
                      onChange={(e) => {
                        if (e.target.value === 'Other') {
                          setShowCustomMaslak(true);
                          setFormData({ ...formData, maslak: '' });
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
                  <select
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className={getSelectClasses('color')}
                  >
                    <option value="Fair">Fair</option>
                    <option value="Medium">Medium</option>
                    <option value="Wheatish">Wheatish</option>
                    <option value="Dark">Dark</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Education & Career Section */}
          <div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Education *</label>
                {!showCustomEducation ? (
                  <select
                    name="education"
                    required
                    value={formData.education}
                    onChange={(e) => {
                      if (e.target.value === 'Other') {
                        setShowCustomEducation(true);
                        setFormData({ ...formData, education: '' });
                      } else {
                        handleInputChange(e);
                      }
                    }}
                    className={getSelectClasses('education')}
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
                  
                  <option value="Other">Other (Custom)</option>
                </select>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter your education"
                      required
                      value={customEducation}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCustomEducation(value);
                        setFormData({ ...formData, education: value });
                      }}
                      className="w-full px-3 py-2.5 pr-12 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 touch-manipulation font-light bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomEducation(false);
                        setCustomEducation('');
                        setFormData({ ...formData, education: '' });
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600 hover:text-gray-800 bg-gray-100 px-2 py-1 rounded"
                    >
                      ↩️
                    </button>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.gender === 'Male' ? 'Job/Business *' : 'Work/Occupation *'}
                </label>
                {!showCustomOccupation ? (
                  <select
                    name="occupation"
                    required
                    value={formData.occupation}
                    onChange={(e) => {
                      if (e.target.value === 'Other') {
                        setShowCustomOccupation(true);
                        setFormData({ ...formData, occupation: '' });
                      } else {
                        handleInputChange(e);
                      }
                    }}
                    className={getSelectClasses('occupation')}
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
                    <option value="Other">Other (Custom)</option>
                  </optgroup>
                </select>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter your occupation"
                      required
                      value={customOccupation}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCustomOccupation(value);
                        setFormData({ ...formData, occupation: value });
                      }}
                      className="w-full px-3 py-2.5 pr-12 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 touch-manipulation font-light bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomOccupation(false);
                        setCustomOccupation('');
                        setFormData({ ...formData, occupation: '' });
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600 hover:text-gray-800 bg-gray-100 px-2 py-1 rounded"
                    >
                      ↩️
                    </button>
                  </div>
                )}
                {validationErrors['occupation'] && (
                  <p className="mt-1 text-xs text-red-600">
                    {validationErrors['occupation']}
                  </p>
                )}
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

              {/* Photo Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
                  {photoPreview ? (
                    <div className="space-y-2">
                      <div className="relative inline-block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photoPreview}
                          alt="Profile preview"
                          className="w-20 h-20 object-cover rounded-full mx-auto border-2 border-emerald-200"
                        />
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors text-xs"
                        >
                          ×
                        </button>
                      </div>
                      <p className="text-xs text-gray-600">Photo selected</p>
                      <label className="inline-flex items-center px-3 py-1.5 text-xs bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 cursor-pointer transition-colors font-light">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handlePhotoChange}
                        />
                        Change
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-2xl">📸</div>
                      <p className="text-xs text-gray-600">Upload photo</p>
                      <label className="inline-flex items-center px-4 py-2 text-xs bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg cursor-pointer transition-all touch-manipulation font-light">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handlePhotoChange}
                        />
                        📷 Choose
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
            </>
          )}

          {/* STEP 3: Family & Contact Information */}
          {currentStep === 3 && (
            <>
          {/* Family & Contact Information */}
          <div>
            <div className="space-y-4">
              <div className="space-y-4">
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

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brothers</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Total Brothers</label>
                      <input
                        type="number"
                        name="numberOfBrothers"
                        value={formData.numberOfBrothers}
                        onFocus={(e) => e.target.value === '0' && (e.target.value = '')}
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
                        onFocus={(e) => e.target.value === '0' && (e.target.value = '')}
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
                        onFocus={(e) => e.target.value === '0' && (e.target.value = '')}
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
                        onFocus={(e) => e.target.value === '0' && (e.target.value = '')}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">House Type *</label>
                {!showCustomHouseType ? (
                  <select
                    name="houseType"
                    required
                    value={formData.houseType}
                    onChange={(e) => {
                      if (e.target.value === 'Other') {
                        setShowCustomHouseType(true);
                        setFormData({ ...formData, houseType: '' });
                      } else {
                        handleInputChange(e);
                      }
                    }}
                    className={selectClasses}
                  >
                    <option value="Family House">Family House</option>
                    <option value="Own House">Own House</option>
                    <option value="Rent">Rent</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Other">Other (Custom)</option>
                  </select>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter house type"
                      required
                      value={customHouseType}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCustomHouseType(value);
                        setFormData({ ...formData, houseType: value });
                      }}
                      className="w-full px-3 py-2.5 pr-12 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 touch-manipulation font-light bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomHouseType(false);
                        setCustomHouseType('');
                        setFormData({ ...formData, houseType: '' });
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600 hover:text-gray-800 bg-gray-100 px-2 py-1 rounded"
                    >
                      ↩️
                    </button>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                  {!showCustomCountry ? (
                    <select
                      name="country"
                      required
                      value={formData.country}
                      onChange={(e) => {
                        if (e.target.value === 'Other') {
                          setShowCustomCountry(true);
                          setFormData({ ...formData, country: '' });
                        } else {
                          handleInputChange(e);
                        }
                      }}
                      className={getSelectClasses('country')}
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
                      <option value="Other">Other (Custom)</option>
                    </select>
                  ) : (
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter country"
                        required
                        value={customCountry}
                        onChange={(e) => {
                          const value = e.target.value;
                          setCustomCountry(value);
                          setFormData({ ...formData, country: value });
                        }}
                        className="w-full px-3 py-2.5 pr-12 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 touch-manipulation font-light bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomCountry(false);
                          setCustomCountry('');
                          setFormData({ ...formData, country: 'Pakistan' });
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600 hover:text-gray-800 bg-gray-100 px-2 py-1 rounded"
                      >
                        ↩️
                      </button>
                    </div>
                  )}
                  {validationErrors['country'] && (
                    <p className="mt-1 text-xs text-red-600">
                      {validationErrors['country']}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  {!showCustomCity ? (
                    <select
                      name="city"
                      required
                      value={formData.city}
                      onChange={(e) => {
                        if (e.target.value === 'Other') {
                          setShowCustomCity(true);
                          setFormData({ ...formData, city: '' });
                        } else {
                          handleInputChange(e);
                        }
                      }}
                      className={getSelectClasses('city')}
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
                      
                      <option value="Other">Other (Custom)</option>
                    </select>
                  ) : (
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter city"
                        required
                        value={customCity}
                        onChange={(e) => {
                          const value = e.target.value;
                          setCustomCity(value);
                          setFormData({ ...formData, city: value });
                        }}
                        className="w-full px-3 py-2.5 pr-12 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 touch-manipulation font-light bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomCity(false);
                          setCustomCity('');
                          setFormData({ ...formData, city: '' });
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600 hover:text-gray-800 bg-gray-100 px-2 py-1 rounded"
                      >
                        ↩️
                      </button>
                    </div>
                  )}
                  {validationErrors['city'] && (
                    <p className="mt-1 text-xs text-red-600">
                      {validationErrors['city']}\n                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <textarea
                  name="address"
                  rows={2}
                  required
                  placeholder="Enter your detailed address (e.g., House #123, Street 5, Area Name)"
                  value={formData.address || ''}
                  onChange={handleInputChange}
                  className={getTextareaClasses('address')}
                />
                {validationErrors['address'] && (
                  <p className="mt-1 text-xs text-red-600">
                    {validationErrors['address']}
                  </p>
                )}
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
                  className={getInputClasses('contactNumber')}
                />
                {validationErrors['contactNumber'] && (
                  <p className="mt-1 text-xs text-red-600">
                    {validationErrors['contactNumber']}
                  </p>
                )}
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
            </div>
          </div>
            </>
          )}

          {/* STEP 4: Partner Requirements */}
          {currentStep === 4 && (
            <>
          {/* Partner Requirements */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-xl relative overflow-hidden -mx-5">
            <div className="px-5 py-6">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-pink-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-100 rounded-full translate-y-8 -translate-x-8 opacity-50"></div>
            
            {/* Header */}
            <div className="relative z-10 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">💕</span>
                </div>
                <h2 className="text-lg font-bold text-gray-800">Partner Requirements</h2>
              </div>
              <p className="text-sm text-gray-600 ml-11">Tell us about your ideal life partner preferences</p>
            </div>
            
            <div className="space-y-4 relative z-10">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <span className="text-pink-500">🎂</span>
                  Preferred Age Range
                  <span className="text-red-500">*</span>
                </label>
                {validationErrors.ageRange && (
                  <p className="text-red-500 text-xs mb-1">{validationErrors.ageRange}</p>
                )}
                {!showCustomReqAgeRange ? (
                  <div className="flex gap-2">
                    <select
                      name="requirements.ageRange"
                      value={`${formData.requirements.ageRange.min}-${formData.requirements.ageRange.max}`}
                      onChange={(e) => {
                        // Clear error
                        setValidationErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.ageRange;
                          return newErrors;
                        });
                        
                        if (e.target.value === 'custom') {
                          setShowCustomReqAgeRange(true);
                          setCustomReqAgeMin(formData.requirements.ageRange.min.toString());
                          setCustomReqAgeMax(formData.requirements.ageRange.max.toString());
                        } else {
                          const [min, max] = e.target.value.split('-').map(Number);
                          setFormData(prev => ({
                            ...prev,
                            requirements: {
                              ...prev.requirements,
                              ageRange: { min, max }
                            }
                          }));
                        }
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
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        placeholder="Min age"
                        value={customReqAgeMin}
                        onChange={(e) => {
                          // Clear error
                          setValidationErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.ageRange;
                            return newErrors;
                          });
                          
                          setCustomReqAgeMin(e.target.value);
                          if (e.target.value && customReqAgeMax) {
                            setFormData(prev => ({
                              ...prev,
                              requirements: {
                                ...prev.requirements,
                                ageRange: { min: parseInt(e.target.value), max: parseInt(customReqAgeMax) }
                              }
                            }));
                          }
                        }}
                        className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-400/50 focus:border-pink-400"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="number"
                        placeholder="Max age"
                        value={customReqAgeMax}
                        onChange={(e) => {
                          // Clear error
                          setValidationErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.ageRange;
                            return newErrors;
                          });
                          
                          setCustomReqAgeMax(e.target.value);
                          if (customReqAgeMin && e.target.value) {
                            setFormData(prev => ({
                              ...prev,
                              requirements: {
                                ...prev.requirements,
                                ageRange: { min: parseInt(customReqAgeMin), max: parseInt(e.target.value) }
                              }
                            }));
                          }
                        }}
                        className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-400/50 focus:border-pink-400"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomReqAgeRange(false);
                        }}
                        className="px-3 py-2 text-xs bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        title="Back to dropdown"
                      >
                        ↩️
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <span className="text-pink-500">📏</span>
                  Preferred Height Range
                </label>
                {!showCustomReqHeightRange ? (
                  <select
                    name="requirements.heightRange"
                    value={`${formData.requirements.heightRange.min}-${formData.requirements.heightRange.max}`}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setShowCustomReqHeightRange(true);
                        setCustomReqHeightMin(formData.requirements.heightRange.min);
                        setCustomReqHeightMax(formData.requirements.heightRange.max);
                      } else {
                        const [min, max] = e.target.value.split('-');
                        setFormData(prev => ({
                          ...prev,
                          requirements: {
                            ...prev.requirements,
                            heightRange: { min, max }
                          }
                        }));
                      }
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
                    <option value="custom">Custom Range</option>
                  </select>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Min (e.g., 5.0)"
                        value={customReqHeightMin}
                        onChange={(e) => {
                          setCustomReqHeightMin(e.target.value);
                          if (e.target.value && customReqHeightMax) {
                            setFormData(prev => ({
                              ...prev,
                              requirements: {
                                ...prev.requirements,
                                heightRange: { min: e.target.value, max: customReqHeightMax }
                              }
                            }));
                          }
                        }}
                        className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-400/50 focus:border-pink-400"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="text"
                        placeholder="Max (e.g., 6.0)"
                        value={customReqHeightMax}
                        onChange={(e) => {
                          setCustomReqHeightMax(e.target.value);
                          if (customReqHeightMin && e.target.value) {
                            setFormData(prev => ({
                              ...prev,
                              requirements: {
                                ...prev.requirements,
                                heightRange: { min: customReqHeightMin, max: e.target.value }
                              }
                            }));
                          }
                        }}
                        className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-400/50 focus:border-pink-400"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomReqHeightRange(false);
                        }}
                        className="px-3 py-2 text-xs bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        title="Back to dropdown"
                      >
                        ↩️
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <span className="text-blue-500">🎓</span>
                  Preferred Education Level
                  <span className="text-red-500">*</span>
                </label>
                {validationErrors.education && (
                  <p className="text-red-500 text-xs mb-1">{validationErrors.education}</p>
                )}
                {showCustomReqEducation ? (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter custom education requirement"
                      value={customReqEducation}
                      onChange={(e) => {
                        // Clear error
                        setValidationErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.education;
                          return newErrors;
                        });
                        
                        setCustomReqEducation(e.target.value);
                        setFormData(prev => ({
                          ...prev,
                          requirements: {
                            ...prev.requirements,
                            education: e.target.value
                          }
                        }));
                      }}
                      className="w-full pr-10 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400/50 focus:border-blue-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomReqEducation(false);
                        setFormData(prev => ({
                          ...prev,
                          requirements: {
                            ...prev.requirements,
                            education: ''
                          }
                        }));
                        setCustomReqEducation('');
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                      title="Back to dropdown"
                    >
                      ↩️
                    </button>
                  </div>
                ) : (
                  <select
                    name="requirements.education"
                    value={formData.requirements.education}
                    onChange={(e) => {
                      // Clear error
                      setValidationErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.education;
                        return newErrors;
                      });
                      
                      if (e.target.value === 'Other') {
                        setShowCustomReqEducation(true);
                        setCustomReqEducation('');
                      } else {
                        handleInputChange(e);
                      }
                    }}
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
                    <option value="Other">Other (Type below)</option>
                  </select>
                )}
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <span className="text-green-500">💼</span>
                  Partner&apos;s Preferred Work/Job
                </label>
                {showCustomReqOccupation ? (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter custom occupation requirement"
                      value={customReqOccupation}
                      onChange={(e) => {
                        setCustomReqOccupation(e.target.value);
                        setFormData(prev => ({
                          ...prev,
                          requirements: {
                            ...prev.requirements,
                            occupation: e.target.value
                          }
                        }));
                      }}
                      className="w-full pr-10 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400/50 focus:border-green-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomReqOccupation(false);
                        setFormData(prev => ({
                          ...prev,
                          requirements: {
                            ...prev.requirements,
                            occupation: ''
                          }
                        }));
                        setCustomReqOccupation('');
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                      title="Back to dropdown"
                    >
                      ↩️
                    </button>
                  </div>
                ) : (
                  <select
                    name="requirements.occupation"
                    value={formData.requirements.occupation}
                    onChange={(e) => {
                      if (e.target.value === 'Other') {
                        setShowCustomReqOccupation(true);
                        setCustomReqOccupation('');
                      } else {
                        handleInputChange(e);
                      }
                    }}
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
                    <option value="Other">Other (Type below)</option>
                  </select>
                )}
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <span className="text-orange-500">🏠</span>
                  Preferred Family Type
                </label>
                {showCustomReqFamilyType ? (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter custom family type"
                      value={customReqFamilyType}
                      onChange={(e) => {
                        setCustomReqFamilyType(e.target.value);
                        setFormData(prev => ({
                          ...prev,
                          requirements: {
                            ...prev.requirements,
                            familyType: e.target.value
                          }
                        }));
                      }}
                      className="w-full pr-10 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400/50 focus:border-orange-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomReqFamilyType(false);
                        setFormData(prev => ({
                          ...prev,
                          requirements: {
                            ...prev.requirements,
                            familyType: ''
                          }
                        }));
                        setCustomReqFamilyType('');
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                      title="Back to dropdown"
                    >
                      ↩️
                    </button>
                  </div>
                ) : (
                  <select
                    name="requirements.familyType"
                    value={formData.requirements.familyType}
                    onChange={(e) => {
                      if (e.target.value === 'Other') {
                        setShowCustomReqFamilyType(true);
                        setCustomReqFamilyType('');
                      } else {
                        handleInputChange(e);
                      }
                    }}
                    className={selectClasses}
                  >
                    <option value="">Select family type</option>
                    <option value="Joint">Joint Family</option>
                    <option value="Nuclear">Nuclear Family</option>
                    <option value="Any">Any</option>
                    <option value="Other">Other (Type below)</option>
                  </select>
                )}
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
                      {['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bangalore', 'Hyderabad', 'London', 'New York', 'Toronto', 'Sydney', 'Dubai', 'Riyadh', 'Same City', 'Any'].map(location => (
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
                    
                    {/* Custom Location Input */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <h4 className="font-medium text-gray-800 mb-2 text-sm">Other Location (Custom)</h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter custom location"
                          value={customReqLocation}
                          onChange={(e) => setCustomReqLocation(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && customReqLocation.trim()) {
                              e.preventDefault();
                              handleCheckboxChange('location', customReqLocation.trim(), true);
                              setCustomReqLocation('');
                            }
                          }}
                          className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-400/50 focus:border-rose-400"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customReqLocation.trim()) {
                              handleCheckboxChange('location', customReqLocation.trim(), true);
                              setCustomReqLocation('');
                            }
                          }}
                          className="px-3 py-1.5 text-xs bg-rose-500 text-white rounded-lg hover:bg-rose-600"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Cast
                  <span className="text-red-500 ml-1">*</span>
                </label>
                {validationErrors.cast && (
                  <p className="text-red-500 text-xs mb-1">{validationErrors.cast}</p>
                )}
                
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
                    
                    {/* Custom Cast Input */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 text-sm">Other (Custom)</h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter custom cast"
                          value={customReqCast}
                          onChange={(e) => setCustomReqCast(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && customReqCast.trim()) {
                              e.preventDefault();
                              handleCheckboxChange('cast', customReqCast.trim(), true);
                              setCustomReqCast('');
                            }
                          }}
                          className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customReqCast.trim()) {
                              handleCheckboxChange('cast', customReqCast.trim(), true);
                              setCustomReqCast('');
                            }
                          }}
                          className="px-3 py-1.5 text-xs bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                        >
                          Add
                        </button>
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
                    
                    {/* Custom Maslak Input */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 text-sm">Other (Custom)</h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter custom maslak"
                          value={customReqMaslak}
                          onChange={(e) => setCustomReqMaslak(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && customReqMaslak.trim()) {
                              e.preventDefault();
                              handleCheckboxChange('maslak', customReqMaslak.trim(), true);
                              setCustomReqMaslak('');
                            }
                          }}
                          className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400/50 focus:border-blue-400"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customReqMaslak.trim()) {
                              handleCheckboxChange('maslak', customReqMaslak.trim(), true);
                              setCustomReqMaslak('');
                            }
                          }}
                          className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          Add
                        </button>
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
                    
                    {/* Custom House Type Input */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 text-sm">Other (Custom)</h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter custom house type"
                          value={customReqHouseType}
                          onChange={(e) => setCustomReqHouseType(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && customReqHouseType.trim()) {
                              e.preventDefault();
                              handleCheckboxChange('houseType', customReqHouseType.trim(), true);
                              setCustomReqHouseType('');
                            }
                          }}
                          className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400/50 focus:border-purple-400"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customReqHouseType.trim()) {
                              handleCheckboxChange('houseType', customReqHouseType.trim(), true);
                              setCustomReqHouseType('');
                            }
                          }}
                          className="px-3 py-1.5 text-xs bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Marital Status
                  <span className="text-red-500 ml-1">*</span>
                </label>
                {validationErrors.maritalStatus && (
                  <p className="text-red-500 text-xs mb-1">{validationErrors.maritalStatus}</p>
                )}
                
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
                            onChange={(e) => {
                              // Clear error
                              setValidationErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.maritalStatus;
                                return newErrors;
                              });
                              handleCheckboxChange('maritalStatus', status, e.target.checked);
                            }}
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
                    
                    {/* Custom Marital Status Input */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 text-sm">Other (Custom)</h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter custom status"
                          value={customReqMaritalStatus}
                          onChange={(e) => setCustomReqMaritalStatus(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && customReqMaritalStatus.trim()) {
                              e.preventDefault();
                              handleCheckboxChange('maritalStatus', customReqMaritalStatus.trim(), true);
                              setCustomReqMaritalStatus('');
                            }
                          }}
                          className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400/50 focus:border-orange-400"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customReqMaritalStatus.trim()) {
                              handleCheckboxChange('maritalStatus', customReqMaritalStatus.trim(), true);
                              setCustomReqMaritalStatus('');
                            }
                          }}
                          className="px-3 py-1.5 text-xs bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                        >
                          Add
                        </button>
                      </div>
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
                    
                    {/* Custom Mother Tongue Input */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 text-sm">Other (Custom)</h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter custom language"
                          value={customReqMotherTongue}
                          onChange={(e) => setCustomReqMotherTongue(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && customReqMotherTongue.trim()) {
                              e.preventDefault();
                              handleCheckboxChange('motherTongue', customReqMotherTongue.trim(), true);
                              setCustomReqMotherTongue('');
                            }
                          }}
                          className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400/50 focus:border-green-400"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customReqMotherTongue.trim()) {
                              handleCheckboxChange('motherTongue', customReqMotherTongue.trim(), true);
                              setCustomReqMotherTongue('');
                            }
                          }}
                          className="px-3 py-1.5 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          Add
                        </button>
                      </div>
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
                    
                    {/* Custom Nationality Input */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 text-sm">Other (Custom)</h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter custom nationality"
                          value={customReqBelongs}
                          onChange={(e) => setCustomReqBelongs(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && customReqBelongs.trim()) {
                              e.preventDefault();
                              handleCheckboxChange('belongs', customReqBelongs.trim(), true);
                              setCustomReqBelongs('');
                            }
                          }}
                          className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-400/50 focus:border-teal-400"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customReqBelongs.trim()) {
                              handleCheckboxChange('belongs', customReqBelongs.trim(), true);
                              setCustomReqBelongs('');
                            }
                          }}
                          className="px-3 py-1.5 text-xs bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                        >
                          Add
                        </button>
                      </div>
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
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-2 pt-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition-all shadow-sm active:scale-95 touch-manipulation font-medium"
              >
                ← Previous
              </button>
            )}
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-2 rounded-lg text-sm transition-all shadow-sm active:scale-95 touch-manipulation font-medium"
              >
                Next Step →
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 touch-manipulation font-medium"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {photoUploading ? 'Uploading Photo...' : 'Creating Profile...'}
                  </div>
                ) : (
                  'Submit Profile 💕'
                )}
              </button>
            )}
          </div>
        </form>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
