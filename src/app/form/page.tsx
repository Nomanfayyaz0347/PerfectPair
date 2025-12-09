'use client';

import { useState, useEffect } from 'react';
import BottomNavigation from '@/components/BottomNavigation';
import {
  Step1SubmitterType,
  Step2Names,
  Step3GenderAge,
  Step4CastMaritalStatus,
  Step5LanguageOrigin,
  Step6HeightWeight,
  Step7MaslakComplexion,
  Step8EducationCareer,
  Step9PhotoUpload,
  Step10FamilyDetails,
  Step11LocationContact,
  Step12AddressContact,
  Step13PartnerAgeHeight,
  Step14PartnerEducationCareer,
  Step15PartnerFamilyLiving,
  Step16PartnerCastMaslak,
  Step17PartnerStatusLanguage,
  FormHeader,
  ProgressIndicator,
  SuccessScreen,
  NavigationButtons,
  DraftStatus
} from '@/components/form';

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

  // Multi-step form state - Now with more steps for one-by-one fields
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 17; // Partner Requirements also split into multiple steps

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
  const [showCustomIncome, setShowCustomIncome] = useState(false);
  const [customIncome, setCustomIncome] = useState('');
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
        
        // Check if custom values were saved and restore custom input states
        const standardBelongs = ['Pakistan', 'Bangladesh', 'India', 'Afghanistan', 'Iran', 'Turkey', 'Saudi Arabia', 'UAE', 'UK', 'USA', 'Canada', 'Australia', ''];
        const standardHouseTypes = ['Family House', 'Own House', 'Rent', 'Apartment', ''];
        const standardMotherTongues = ['Urdu', 'English', 'Punjabi', 'Sindhi', 'Pashto', 'Balochi', 'Saraiki', 'Hindko', 'Kashmiri', 'Arabic', 'Persian', 'Turkish', ''];
        const standardCasts = ['Syed', 'Sheikh', 'Mughal', 'Pathan', 'Rajput', 'Jat', 'Arain', 'Gujjar', 'Malik', 'Awan', 'Butt', 'Qureshi', 'Ansari', 'Abbasi', 'Kazmi', 'Naqvi', 'Zaidi', 'Hashmi', 'Bukhari', 'Gillani', 'Chaudhry', 'Chaudhary', 'Khatri', 'Memon', 'Dar', 'Lone', 'Khan', 'Baloch', 'Kashmiri', 'Punjabi', 'Sindhi', ''];
        const standardMaritalStatuses = ['Single', 'Divorced', 'Widowed', 'Separated', 'Nikkah Break', 'Second Marriage', ''];
        const standardMaslaks = ['Hanafi', "Shafi'i", 'Maliki', 'Hanbali', 'Shia', 'Ahle Hadith', 'Deobandi', 'Barelvi', 'Twelver Shia', 'Ismaili', 'Zaidi', 'Alavi Bohra', 'Dawoodi Bohra', 'Chishti', 'Qadri', 'Naqshbandi', 'Suhrawardi', 'Ahmadiyya', 'Quranist', 'Non-denominational', 'Christian', 'Hindu', 'Sikh', 'Other Religion', 'Jamaat-e-Islami', ''];
        const standardEducations = ['Matric', 'Intermediate', 'FSc', 'FA', 'ICS', 'A-Levels', 'Bachelor', 'BBA', 'BCom', 'BSc', 'BA', 'BE', 'MBBS', 'LLB', 'BCS', 'Master', 'MBA', 'MSc', 'MA', 'MS', 'MCS', 'PhD', 'CA', 'CMA', 'Diploma', 'Certificate', 'Hafiz', 'Qari', 'Alim', 'Fazil', 'Kamil', 'Dars-e-Nizami', 'Bachelors', 'Masters', 'MPhil', 'BDS', 'Engineering', 'ACCA', 'Islamic Scholar', ''];
        const standardOccupations = ['Student', 'Teacher', 'Doctor', 'Engineer', 'Businessman', 'Government Job', 'Private Job', 'Self Employed', 'Army', 'Navy', 'Air Force', 'Police', 'Lawyer', 'Accountant', 'IT Professional', 'Banker', 'Pilot', 'Overseas', 'Teacher/Professor', 'Pharmacist', 'Architect', 'Software Developer', 'Nurse', 'Business Owner', 'Shopkeeper', 'Trader', 'Contractor', 'Real Estate', 'Import/Export', 'Government Officer', 'Civil Servant', 'Judge', 'Manager', 'Sales Executive', 'Customer Service', 'HR Executive', 'Marketing', 'Electrician', 'Mechanic', 'Plumber', 'Driver', 'Technician', 'Housewife', 'Home Tutor', 'Online Work', 'Part Time Job', 'Home Based Business', 'Freelancer', 'Retired', 'Unemployed', ''];
        const standardCountries = ['Pakistan', 'UAE', 'Saudi Arabia', 'UK', 'USA', 'Canada', 'Australia', 'Germany', 'Malaysia', 'Qatar', 'Kuwait', 'Oman', 'Bahrain', 'Bangladesh', 'India', 'Afghanistan', 'Iran', 'Turkey', ''];
        const standardCities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Hyderabad', 'Sialkot', 'Gujranwala', 'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bangalore', 'London', 'New York', 'Toronto', 'Sydney', 'Dubai', 'Riyadh', ''];
        
        if (parsed.belongs && !standardBelongs.includes(parsed.belongs)) {
          setShowCustomBelongs(true);
          setCustomBelongs(parsed.belongs);
        }
        if (parsed.houseType && !standardHouseTypes.includes(parsed.houseType)) {
          setShowCustomHouseType(true);
          setCustomHouseType(parsed.houseType);
        }
        if (parsed.motherTongue && !standardMotherTongues.includes(parsed.motherTongue)) {
          setShowCustomMotherTongue(true);
          setCustomMotherTongue(parsed.motherTongue);
        }
        if (parsed.cast && !standardCasts.includes(parsed.cast)) {
          setShowCustomCast(true);
          setCustomCast(parsed.cast);
        }
        if (parsed.maritalStatus && !standardMaritalStatuses.includes(parsed.maritalStatus)) {
          setShowCustomMaritalStatus(true);
          setCustomMaritalStatus(parsed.maritalStatus);
        }
        if (parsed.maslak && !standardMaslaks.includes(parsed.maslak)) {
          setShowCustomMaslak(true);
          setCustomMaslak(parsed.maslak);
        }
        if (parsed.education && !standardEducations.includes(parsed.education)) {
          setShowCustomEducation(true);
          setCustomEducation(parsed.education);
        }
        if (parsed.occupation && !standardOccupations.includes(parsed.occupation)) {
          setShowCustomOccupation(true);
          setCustomOccupation(parsed.occupation);
        }
        // Check for custom income
        const standardIncomes = ['', '20,000 - 30,000', '30,000 - 50,000', '50,000 - 75,000', '75,000 - 1,00,000', '1,00,000 - 1,50,000', '1,50,000 - 2,00,000', '2,00,000 - 3,00,000', '3,00,000+', '15,000 - 25,000', '25,000 - 35,000', '35,000 - 45,000', '45,000 - 60,000', '60,000 - 80,000', '80,000 - 1,00,000', '5,000 - 10,000', '10,000 - 20,000', '30,000+', 'Prefer not to say'];
        if (parsed.income && !standardIncomes.includes(parsed.income)) {
          setShowCustomIncome(true);
          setCustomIncome(parsed.income);
        }
        if (parsed.country && !standardCountries.includes(parsed.country)) {
          setShowCustomCountry(true);
          setCustomCountry(parsed.country);
        }
        if (parsed.city && !standardCities.includes(parsed.city)) {
          setShowCustomCity(true);
          setCustomCity(parsed.city);
        }
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
    
    // Step 1: Submitter Info
    if (currentStep === 1) {
      if (!formData.submittedBy) errors.submittedBy = 'Please select who is submitting';
      if (formData.submittedBy === 'Partner Matchmaker' && !formData.matchmakerName) {
        errors.matchmakerName = 'Matchmaker name is required';
      }
    }
    // Step 2: Name & Father Name
    else if (currentStep === 2) {
      if (!formData.name || formData.name.trim() === '') errors.name = 'Full name is required';
      if (!formData.fatherName || formData.fatherName.trim() === '') errors.fatherName = "Father's name is required";
      if (nameAvailable === false) {
        errors.name = 'Profile already exists with this name and father name';
      }
    }
    // Step 3: Gender & Age
    else if (currentStep === 3) {
      if (!formData.gender) errors.gender = 'Gender is required';
      if (!formData.age || formData.age < 18 || formData.age > 80) errors.age = 'Valid age (18-80) is required';
    }
    // Step 4: Cast & Marital Status
    else if (currentStep === 4) {
      if (!formData.cast || formData.cast.trim() === '') errors.cast = 'Cast is required';
      if (!formData.maritalStatus || formData.maritalStatus.trim() === '') errors.maritalStatus = 'Marital status is required';
    }
    // Step 5: Mother Tongue & Belongs
    else if (currentStep === 5) {
      if (!formData.motherTongue || formData.motherTongue.trim() === '') errors.motherTongue = 'Mother tongue is required';
      if (!formData.belongs || formData.belongs.trim() === '') errors.belongs = 'Belongs is required';
    }
    // Step 6: Height & Weight (Optional)
    else if (currentStep === 6) {
      // Optional fields, no validation
    }
    // Step 7: Maslak & Complexion (Optional)
    else if (currentStep === 7) {
      // Optional fields, no validation
    }
    // Step 8: Education & Occupation
    else if (currentStep === 8) {
      if (!formData.education || formData.education.trim() === '') errors.education = 'Education is required';
      if (!formData.occupation || formData.occupation.trim() === '') errors.occupation = 'Job/Business is required';
    }
    // Step 9: Photo Upload (Optional)
    else if (currentStep === 9) {
      // Optional, no validation
    }
    // Step 10: Family Details (Optional)
    else if (currentStep === 10) {
      // Optional fields
    }
    // Step 11: Location (House Type, Country, City)
    else if (currentStep === 11) {
      if (!formData.houseType || formData.houseType.trim() === '') errors.houseType = 'House type is required';
      if (!formData.country || formData.country.trim() === '') errors.country = 'Country is required';
      if (!formData.city || formData.city.trim() === '') errors.city = 'City is required';
    }
    // Step 12: Address & Contact
    else if (currentStep === 12) {
      if (!formData.address || formData.address.trim() === '') errors.address = 'Address is required';
      if (!formData.contactNumber || formData.contactNumber.trim() === '') errors.contactNumber = 'Contact number is required';
    }
    // Step 13: Partner Age & Height Range
    else if (currentStep === 13) {
      if (!formData.requirements.ageRange.min || !formData.requirements.ageRange.max) {
        errors.ageRange = 'Preferred age range is required';
      }
    }
    // Step 14: Partner Education & Occupation
    else if (currentStep === 14) {
      if (!formData.requirements.education || formData.requirements.education.trim() === '') {
        errors.education = 'Preferred education level is required';
      }
    }
    // Step 15: Partner Family & Living (Optional)
    else if (currentStep === 15) {
      // Optional fields
    }
    // Step 16: Partner Cast & Maslak
    else if (currentStep === 16) {
      if (!formData.requirements.cast || formData.requirements.cast.length === 0) {
        errors.cast = 'At least one preferred cast is required';
      }
    }
    // Step 17: Partner Marital Status & Language
    else if (currentStep === 17) {
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

      // Use submittedBy directly (no 'Client/Self' mapping needed)
      const submittedBy = formData.submittedBy;

      // Use custom value if present for these fields
      const maritalStatus = showCustomMaritalStatus && customMaritalStatus.trim()
        ? customMaritalStatus.trim()
        : formData.maritalStatus;
      const motherTongue = showCustomMotherTongue && customMotherTongue.trim()
        ? customMotherTongue.trim()
        : formData.motherTongue;
      const belongs = showCustomBelongs && customBelongs.trim()
        ? customBelongs.trim()
        : formData.belongs;
      const houseType = showCustomHouseType && customHouseType.trim()
        ? customHouseType.trim()
        : formData.houseType;

      // Submit profile with photo URL (use latest formData or photoUrl)
      const profileData: any = {
        ...formData,
        submittedBy,
        maritalStatus,
        motherTongue,
        belongs,
        houseType,
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
    return <SuccessScreen onCreateAnother={() => setSuccess(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/50 to-white flex flex-col">
      {/* Header */}
      <FormHeader />

      {/* Main Content */}
      <main className="flex-1 overflow-auto px-5 pb-16">
        <div className="max-w-lg mx-auto">
          {/* Draft Status */}
          <DraftStatus 
            hasDraft={typeof window !== 'undefined' && !!localStorage.getItem('formDraft')}
            onClearDraft={() => {
              if (confirm('Clear saved progress? This cannot be undone.')) {
                localStorage.removeItem('formDraft');
                window.location.reload();
              }
            }}
          />

          {/* Progress Indicator */}
          <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />

          <form onSubmit={handleSubmit} onKeyDown={(e) => {
            if (e.key === 'Enter' && currentStep < 12) {
              e.preventDefault();
            }
          }} noValidate className="bg-white border border-teal-100 rounded-2xl shadow-sm p-5 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

          {/* STEP 1: Submission Info */}
          {currentStep === 1 && (
            <Step1SubmitterType
              formData={formData}
              setFormData={setFormData}
              validationErrors={validationErrors}
              setValidationErrors={setValidationErrors}
              inputClasses={inputClasses}
              selectClasses={selectClasses}
              textareaClasses={textareaClasses}
              getInputClasses={getInputClasses}
              getSelectClasses={getSelectClasses}
              getTextareaClasses={getTextareaClasses}
              handleInputChange={handleInputChange}
            />
          )}

          {/* STEP 2: Name Information */}
          {currentStep === 2 && (
            <Step2Names
              formData={formData}
              setFormData={setFormData}
              validationErrors={validationErrors}
              setValidationErrors={setValidationErrors}
              inputClasses={inputClasses}
              selectClasses={selectClasses}
              textareaClasses={textareaClasses}
              getInputClasses={getInputClasses}
              getSelectClasses={getSelectClasses}
              getTextareaClasses={getTextareaClasses}
              handleInputChange={handleInputChange}
              nameCheckLoading={nameCheckLoading}
              nameAvailable={nameAvailable}
              checkNameAvailability={checkNameAvailability}
            />
          )}

          {/* STEP 3: Gender & Age */}
          {currentStep === 3 && (
            <Step3GenderAge
              formData={formData}
              setFormData={setFormData}
              validationErrors={validationErrors}
              setValidationErrors={setValidationErrors}
              inputClasses={inputClasses}
              selectClasses={selectClasses}
              textareaClasses={textareaClasses}
              getInputClasses={getInputClasses}
              getSelectClasses={getSelectClasses}
              getTextareaClasses={getTextareaClasses}
              handleInputChange={handleInputChange}
            />
          )}

          {/* STEP 4: Cast & Marital Status */}
          {currentStep === 4 && (
            <Step4CastMaritalStatus
              formData={formData}
              setFormData={setFormData}
              validationErrors={validationErrors}
              getSelectClasses={getSelectClasses}
              handleInputChange={handleInputChange}
              showCustomCast={showCustomCast}
              setShowCustomCast={setShowCustomCast}
              customCast={customCast}
              setCustomCast={setCustomCast}
              showCustomMaritalStatus={showCustomMaritalStatus}
              setShowCustomMaritalStatus={setShowCustomMaritalStatus}
              customMaritalStatus={customMaritalStatus}
              setCustomMaritalStatus={setCustomMaritalStatus}
            />
          )}

          {/* STEP 5: Mother Tongue & Belongs */}
          {currentStep === 5 && (
            <Step5LanguageOrigin
              formData={formData}
              handleInputChange={handleInputChange}
              setFormData={setFormData}
              selectClasses={selectClasses}
              validationErrors={validationErrors}
              showCustomMotherTongue={showCustomMotherTongue}
              setShowCustomMotherTongue={setShowCustomMotherTongue}
              customMotherTongue={customMotherTongue}
              setCustomMotherTongue={setCustomMotherTongue}
              showCustomBelongs={showCustomBelongs}
              setShowCustomBelongs={setShowCustomBelongs}
              customBelongs={customBelongs}
              setCustomBelongs={setCustomBelongs}
            />
          )}

          {/* STEP 6: Height & Weight */}
          {currentStep === 6 && (
            <Step6HeightWeight
              formData={formData}
              handleInputChange={handleInputChange}
              getSelectClasses={getSelectClasses}
              getInputClasses={getInputClasses}
            />
          )}

          {/* STEP 7: Maslak & Complexion */}
          {currentStep === 7 && (
            <Step7MaslakComplexion
              formData={formData}
              handleInputChange={handleInputChange}
              setFormData={setFormData}
              getSelectClasses={getSelectClasses}
              showCustomMaslak={showCustomMaslak}
              setShowCustomMaslak={setShowCustomMaslak}
              customMaslak={customMaslak}
              setCustomMaslak={setCustomMaslak}
            />
          )}

          {/* STEP 8: Education & Career */}
          {currentStep === 8 && (
            <Step8EducationCareer
              formData={formData}
              handleInputChange={handleInputChange}
              setFormData={setFormData}
              getSelectClasses={getSelectClasses}
              selectClasses={selectClasses}
              validationErrors={validationErrors}
              showCustomEducation={showCustomEducation}
              setShowCustomEducation={setShowCustomEducation}
              customEducation={customEducation}
              setCustomEducation={setCustomEducation}
              showCustomOccupation={showCustomOccupation}
              setShowCustomOccupation={setShowCustomOccupation}
              customOccupation={customOccupation}
              setCustomOccupation={setCustomOccupation}
              showCustomIncome={showCustomIncome}
              setShowCustomIncome={setShowCustomIncome}
              customIncome={customIncome}
              setCustomIncome={setCustomIncome}
            />
          )}

          {/* STEP 9: Photo Upload */}
          {currentStep === 9 && (
            <Step9PhotoUpload
              photoPreview={photoPreview}
              handlePhotoChange={handlePhotoChange}
              removePhoto={removePhoto}
            />
          )}

          {/* STEP 10: Family Details */}
          {currentStep === 10 && (
            <Step10FamilyDetails
              formData={formData}
              setFormData={setFormData}
              inputClasses={inputClasses}
            />
          )}

          {/* STEP 11: Location & Contact */}
          {currentStep === 11 && (
            <Step11LocationContact
              formData={formData}
              handleInputChange={handleInputChange}
              setFormData={setFormData}
              getSelectClasses={getSelectClasses}
              selectClasses={selectClasses}
              validationErrors={validationErrors}
              showCustomHouseType={showCustomHouseType}
              setShowCustomHouseType={setShowCustomHouseType}
              customHouseType={customHouseType}
              setCustomHouseType={setCustomHouseType}
              showCustomCountry={showCustomCountry}
              setShowCustomCountry={setShowCustomCountry}
              customCountry={customCountry}
              setCustomCountry={setCustomCountry}
              showCustomCity={showCustomCity}
              setShowCustomCity={setShowCustomCity}
              customCity={customCity}
              setCustomCity={setCustomCity}
            />
          )}

          {/* STEP 12: Address & Contact */}
          {currentStep === 12 && (
            <Step12AddressContact
              formData={formData}
              handleInputChange={handleInputChange}
              getInputClasses={getInputClasses}
              getTextareaClasses={getTextareaClasses}
              textareaClasses={textareaClasses}
              validationErrors={validationErrors}
            />
          )}

          {/* STEP 13: Partner Requirements */}
          {currentStep === 13 && (
            <Step13PartnerAgeHeight
              formData={formData}
              setFormData={setFormData}
              selectClasses={selectClasses}
              validationErrors={validationErrors}
              setValidationErrors={setValidationErrors}
              showCustomReqAgeRange={showCustomReqAgeRange}
              setShowCustomReqAgeRange={setShowCustomReqAgeRange}
              customReqAgeMin={customReqAgeMin}
              setCustomReqAgeMin={setCustomReqAgeMin}
              customReqAgeMax={customReqAgeMax}
              setCustomReqAgeMax={setCustomReqAgeMax}
              showCustomReqHeightRange={showCustomReqHeightRange}
              setShowCustomReqHeightRange={setShowCustomReqHeightRange}
              customReqHeightMin={customReqHeightMin}
              setCustomReqHeightMin={setCustomReqHeightMin}
              customReqHeightMax={customReqHeightMax}
              setCustomReqHeightMax={setCustomReqHeightMax}
            />
          )}

          {/* STEP 14: Partner Education & Occupation */}
          {currentStep === 14 && (
            <Step14PartnerEducationCareer
              formData={formData}
              setFormData={setFormData}
              selectClasses={selectClasses}
              validationErrors={validationErrors}
              setValidationErrors={setValidationErrors}
              showCustomReqEducation={showCustomReqEducation}
              setShowCustomReqEducation={setShowCustomReqEducation}
              customReqEducation={customReqEducation}
              setCustomReqEducation={setCustomReqEducation}
              showCustomReqOccupation={showCustomReqOccupation}
              setShowCustomReqOccupation={setShowCustomReqOccupation}
              customReqOccupation={customReqOccupation}
              setCustomReqOccupation={setCustomReqOccupation}
              handleInputChange={handleInputChange}
            />
          )}

          {/* STEP 15: Partner Family & Living */}
          {currentStep === 15 && (
            <Step15PartnerFamilyLiving
              formData={formData}
              setFormData={setFormData}
              selectClasses={selectClasses}
              inputClasses={inputClasses}
              showCustomReqFamilyType={showCustomReqFamilyType}
              setShowCustomReqFamilyType={setShowCustomReqFamilyType}
              customReqFamilyType={customReqFamilyType}
              setCustomReqFamilyType={setCustomReqFamilyType}
              customReqLocation={customReqLocation}
              setCustomReqLocation={setCustomReqLocation}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              handleCheckboxChange={handleCheckboxChange}
              handleInputChange={handleInputChange}
            />
          )}

          {/* STEP 16: Partner Cast & Maslak */}
          {currentStep === 16 && (
            <Step16PartnerCastMaslak
              formData={formData}
              validationErrors={validationErrors}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              handleCheckboxChange={handleCheckboxChange}
              customReqCast={customReqCast}
              setCustomReqCast={setCustomReqCast}
              customReqMaslak={customReqMaslak}
              setCustomReqMaslak={setCustomReqMaslak}
              customReqHouseType={customReqHouseType}
              setCustomReqHouseType={setCustomReqHouseType}
            />
          )}

          {/* STEP 17: Partner Marital & Language Preferences */}
          {currentStep === 17 && (
            <Step17PartnerStatusLanguage
              formData={formData}
              validationErrors={validationErrors}
              setValidationErrors={setValidationErrors}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              handleCheckboxChange={handleCheckboxChange}
              customReqMaritalStatus={customReqMaritalStatus}
              setCustomReqMaritalStatus={setCustomReqMaritalStatus}
              customReqMotherTongue={customReqMotherTongue}
              setCustomReqMotherTongue={setCustomReqMotherTongue}
              customReqBelongs={customReqBelongs}
              setCustomReqBelongs={setCustomReqBelongs}
            />
          )}

          {/* Navigation Buttons */}
          <NavigationButtons
            currentStep={currentStep}
            totalSteps={totalSteps}
            loading={loading}
            photoUploading={photoUploading}
            onPrevStep={prevStep}
            onNextStep={nextStep}
          />
        </form>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
