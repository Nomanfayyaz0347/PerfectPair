'use client';

import { FormData } from './types';

interface Step8Props {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  getSelectClasses: (fieldName: string) => string;
  selectClasses: string;
  validationErrors: Record<string, string>;
  showCustomEducation: boolean;
  setShowCustomEducation: React.Dispatch<React.SetStateAction<boolean>>;
  customEducation: string;
  setCustomEducation: React.Dispatch<React.SetStateAction<string>>;
  showCustomOccupation: boolean;
  setShowCustomOccupation: React.Dispatch<React.SetStateAction<boolean>>;
  customOccupation: string;
  setCustomOccupation: React.Dispatch<React.SetStateAction<string>>;
  showCustomIncome?: boolean;
  setShowCustomIncome?: React.Dispatch<React.SetStateAction<boolean>>;
  customIncome?: string;
  setCustomIncome?: React.Dispatch<React.SetStateAction<string>>;
}

export default function Step8EducationCareer({ 
  formData, 
  handleInputChange,
  setFormData,
  getSelectClasses,
  selectClasses,
  validationErrors,
  showCustomEducation,
  setShowCustomEducation,
  customEducation,
  setCustomEducation,
  showCustomOccupation,
  setShowCustomOccupation,
  customOccupation,
  setCustomOccupation,
  showCustomIncome = false,
  setShowCustomIncome,
  customIncome = '',
  setCustomIncome
}: Step8Props) {
  return (
    <div>
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">🎓 Education & Career</h2>
          <p className="text-xs text-gray-600 mt-1">Education and occupation details</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Education <span className="text-red-500">*</span></label>
          <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
            💡 Apni taleem select karein - Matric, Inter, Bachelor, Master waghaira. Religious education bhi select kar sakte hain jaise Hafiz, Alim. Agar list mein nahi hai to "Other" select karke khud likh sakte hain.
          </div>
          {!showCustomEducation ? (
            <select
              name="education"
              required
              value={formData.education}
              onChange={(e) => {
                if (e.target.value === 'Other') {
                  setShowCustomEducation(true);
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
            {formData.gender === 'Male' ? 'Job/Business' : 'Work/Occupation'} <span className="text-red-500">*</span>
          </label>
          <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
            💡 Apna kaam/pesha select karein - Job, Business, Doctor, Engineer waghaira. Agar Student ya Housewife hain to woh bhi select kar sakte hain. Agar list mein nahi hai to "Other" select karke khud likh sakte hain.
          </div>
          {!showCustomOccupation ? (
            <select
              name="occupation"
              required
              value={formData.occupation}
              onChange={(e) => {
                if (e.target.value === 'Other') {
                  setShowCustomOccupation(true);
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
          <div className="mb-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
            💡 Mahana amdani/salary ki range select karein. Student/Housewife ke liye family income dein. Agar exact amount batana chahte hain to "Other" select karein.
          </div>
          {!showCustomIncome ? (
            <select
              name="income"
              value={formData.income}
              onChange={(e) => {
                if (e.target.value === 'Other') {
                  setShowCustomIncome?.(true);
                } else {
                  handleInputChange(e);
                }
              }}
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
              
              <option value="Prefer not to say">🤐 Prefer not to say / Batana Nahi</option>
              <option value="Other">✏️ Other (Custom) / Khud Likhein</option>
            </select>
          ) : (
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your income (e.g. Rs. 55,000)"
                value={customIncome}
                onChange={(e) => {
                  const value = e.target.value;
                  setCustomIncome?.(value);
                  setFormData({ ...formData, income: value });
                }}
                className="w-full px-3 py-2.5 pr-12 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400 transition-colors duration-200 touch-manipulation font-light bg-white"
              />
              <button
                type="button"
                onClick={() => {
                  setShowCustomIncome?.(false);
                  setCustomIncome?.('');
                  setFormData({ ...formData, income: '' });
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600 hover:text-gray-800 bg-gray-100 px-2 py-1 rounded"
              >
                ↩️
              </button>
            </div>
          )}
          <p className="mt-1 text-xs text-gray-500">Agar exact salary likhna chahte ho to &quot;Other (Custom)&quot; select karo</p>
        </div>
      </div>
    </div>
  );
}
