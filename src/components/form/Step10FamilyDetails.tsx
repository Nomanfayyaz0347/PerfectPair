'use client';

import { FormData } from './types';

interface Step10Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  inputClasses: string;
}

export default function Step10FamilyDetails({ 
  formData, 
  setFormData,
  inputClasses
}: Step10Props) {
  return (
    <div>
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">👨‍👩‍👧‍👦 Family Details</h2>
          <p className="text-xs text-gray-600 mt-1">Parents and siblings information</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Parents</label>
            <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
              💡 Agar walid ya walida hayat hain to checkbox tick karein. Agar nahi hain to khali chor dein.
            </div>
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
            <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
              💡 Kitne bhai hain aur kitne shadi shuda hain - dono likhen. Agar nahi hain to 0 likhen.
            </div>
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
            <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
              💡 Kitni behnen hain aur kitni shadi shuda hain - dono likhen. Agar nahi hain to 0 likhen.
            </div>
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
      </div>
    </div>
  );
}
