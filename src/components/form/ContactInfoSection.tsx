'use client';

import React from 'react';
import { FormData } from './types';

interface ContactInfoSectionProps {
  formData: FormData;
  validationErrors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  getInputClasses: (fieldName: string) => string;
  getSelectClasses: (fieldName: string) => string;
  getTextareaClasses: (fieldName: string) => string;
  showCustomCountry: boolean;
  setShowCustomCountry: (show: boolean) => void;
  customCountry: string;
  setCustomCountry: (value: string) => void;
  showCustomCity: boolean;
  setShowCustomCity: (show: boolean) => void;
  customCity: string;
  setCustomCity: (value: string) => void;
  setFormData: (data: any) => void;
}

export default function ContactInfoSection({
  formData,
  validationErrors,
  handleInputChange,
  getInputClasses,
  getSelectClasses,
  getTextareaClasses,
  showCustomCountry,
  setShowCustomCountry,
  customCountry,
  setCustomCountry,
  showCustomCity,
  setShowCustomCity,
  customCity,
  setCustomCity,
  setFormData,
}: ContactInfoSectionProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
      <div className="space-y-4">
        {/* Contact Number */}
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

        {/* Address */}
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
      </div>
    </div>
  );
}
