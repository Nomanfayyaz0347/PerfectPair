'use client';

import React from 'react';
import { FormData } from './types';

interface PhysicalInfoSectionProps {
  formData: FormData;
  validationErrors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  getInputClasses: (fieldName: string) => string;
  getSelectClasses: (fieldName: string) => string;
  showCustomComplexion: boolean;
  setShowCustomComplexion: (show: boolean) => void;
  customComplexion: string;
  setCustomComplexion: (value: string) => void;
  setFormData: (data: any) => void;
}

export default function PhysicalInfoSection({
  formData,
  validationErrors,
  handleInputChange,
  getInputClasses,
  getSelectClasses,
  showCustomComplexion,
  setShowCustomComplexion,
  customComplexion,
  setCustomComplexion,
  setFormData,
}: PhysicalInfoSectionProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Physical Information</h2>
      <div className="space-y-4">
        {/* Age and Height */}
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
              className={getInputClasses('age')}
            />
            {validationErrors['age'] && (
              <p className="mt-1 text-xs text-red-600">
                {validationErrors['age']}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
            <input
              type="text"
              name="height"
              placeholder="5.6 feet"
              value={formData.height}
              onChange={handleInputChange}
              className={getInputClasses('height')}
            />
            {validationErrors['height'] && (
              <p className="mt-1 text-xs text-red-600">
                {validationErrors['height']}
              </p>
            )}
          </div>
        </div>

        {/* Weight and Complexion */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
            <input
              type="text"
              name="weight"
              placeholder="65 kg"
              value={formData.weight}
              onChange={handleInputChange}
              className={getInputClasses('weight')}
            />
            {validationErrors['weight'] && (
              <p className="mt-1 text-xs text-red-600">
                {validationErrors['weight']}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Complexion</label>
            {!showCustomComplexion ? (
              <select
                name="color"
                value={formData.color}
                onChange={(e) => {
                  if (e.target.value === 'Other') {
                    setShowCustomComplexion(true);
                    setFormData({ ...formData, color: '' });
                  } else {
                    handleInputChange(e);
                  }
                }}
                className={getSelectClasses('color')}
              >
                <option value="Fair">Fair</option>
                <option value="Medium">Medium</option>
                <option value="Wheatish">Wheatish</option>
                <option value="Brown">Brown</option>
                <option value="Dark">Dark</option>
                <option value="Other">Other (Custom)</option>
              </select>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter complexion"
                  value={customComplexion}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCustomComplexion(value);
                    setFormData({ ...formData, color: value });
                  }}
                  className="w-full px-3 py-2.5 pr-12 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 touch-manipulation font-light bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomComplexion(false);
                    setCustomComplexion('');
                    setFormData({ ...formData, color: 'Fair' });
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600 hover:text-gray-800 bg-gray-100 px-2 py-1 rounded"
                >
                  ↩️
                </button>
              </div>
            )}
            {validationErrors['color'] && (
              <p className="mt-1 text-xs text-red-600">
                {validationErrors['color']}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
