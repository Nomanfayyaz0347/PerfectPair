'use client';

import { FormData } from './types';

interface Step12Props {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  getInputClasses: (fieldName: string) => string;
  getTextareaClasses: (fieldName: string) => string;
  textareaClasses: string;
  validationErrors: Record<string, string>;
}

export default function Step12AddressContact({ 
  formData, 
  handleInputChange,
  getInputClasses,
  getTextareaClasses,
  textareaClasses,
  validationErrors
}: Step12Props) {
  return (
    <div>
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">📞 Address & Contact</h2>
          <p className="text-xs text-gray-600 mt-1">Your address and phone number</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address <span className="text-red-500">*</span></label>
          <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
            💡 Mukammal address likhen (street, area, city) taake raabta asaan ho.
          </div>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number <span className="text-red-500">*</span></label>
          <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
            💡 Apna ya family ka WhatsApp/mobile number likhen. Sirf admin ke pass rahega.
          </div>
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
          <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
            💡 Khaas family info ya notes yahan likh sakte hain (optional).
          </div>
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
  );
}
