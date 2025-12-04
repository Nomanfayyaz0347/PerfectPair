'use client';

import React from 'react';
import { FormData } from './types';

interface ProfessionalInfoSectionProps {
  formData: FormData;
  validationErrors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  getSelectClasses: (fieldName: string) => string;
  showCustomEducation: boolean;
  setShowCustomEducation: (show: boolean) => void;
  customEducation: string;
  setCustomEducation: (value: string) => void;
  showCustomOccupation: boolean;
  setShowCustomOccupation: (show: boolean) => void;
  customOccupation: string;
  setCustomOccupation: (value: string) => void;
  setFormData: (data: any) => void;
}

export default function ProfessionalInfoSection({
  formData,
  validationErrors,
  handleInputChange,
  getSelectClasses,
  showCustomEducation,
  setShowCustomEducation,
  customEducation,
  setCustomEducation,
  showCustomOccupation,
  setShowCustomOccupation,
  customOccupation,
  setCustomOccupation,
  setFormData,
}: ProfessionalInfoSectionProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h2>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">Education and Occupation sections ready for implementation</p>
      </div>
    </div>
  );
}
