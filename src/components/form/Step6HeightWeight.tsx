'use client';

import { FormData } from './types';

interface Step6Props {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  getSelectClasses: (fieldName: string) => string;
  getInputClasses: (fieldName: string) => string;
}

export default function Step6HeightWeight({ 
  formData, 
  handleInputChange,
  getSelectClasses,
  getInputClasses
}: Step6Props) {
  return (
    <div>
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">📏 Physical Details</h2>
          <p className="text-xs text-gray-600 mt-1">Height and weight information (Optional)</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
          <select
            name="height"
            value={formData.height}
            onChange={handleInputChange}
            className={getSelectClasses('height')}
          >
            <option value="Don't Know">🤷 Don&apos;t Know / Pata Nahi</option>
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
          <p className="mt-1 text-xs text-gray-500">Agar pata nahi to &quot;Don&apos;t Know&quot; select karein</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
          <select
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            className={getSelectClasses('weight')}
          >
            <option value="Don't Know">🤷 Don&apos;t Know / Pata Nahi</option>
            <option value="40">40 kg</option>
            <option value="45">45 kg</option>
            <option value="50">50 kg</option>
            <option value="55">55 kg</option>
            <option value="60">60 kg</option>
            <option value="65">65 kg</option>
            <option value="70">70 kg</option>
            <option value="75">75 kg</option>
            <option value="80">80 kg</option>
            <option value="85">85 kg</option>
            <option value="90">90 kg</option>
            <option value="95">95 kg</option>
            <option value="100">100 kg</option>
            <option value="105">105 kg</option>
            <option value="110">110 kg</option>
            <option value="115">115 kg</option>
            <option value="120">120 kg</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">Agar pata nahi to &quot;Don&apos;t Know&quot; select karein</p>
        </div>
      </div>
    </div>
  );
}
