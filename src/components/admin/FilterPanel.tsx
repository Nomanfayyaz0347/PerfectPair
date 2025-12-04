'use client';

import { Filters } from './types';

interface FilterPanelProps {
  filters: Filters;
  isOpen: boolean;
  onToggle: () => void;
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onApply: () => void;
  onClear: () => void;
}

export default function FilterPanel({
  filters,
  isOpen,
  onToggle,
  onFilterChange,
  onApply,
  onClear,
}: FilterPanelProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <h2 className="text-base font-semibold text-gray-900">Search & Filters</h2>
        <div className="text-emerald-600 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {isOpen && (
        <div className="mt-4">
          <div className="space-y-3 mb-4">
            <input
              type="text"
              name="search"
              placeholder="Search by name..."
              value={filters.search}
              onChange={onFilterChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                name="ageMin"
                placeholder="Min Age"
                value={filters.ageMin}
                onChange={onFilterChange}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
              <input
                type="number"
                name="ageMax"
                placeholder="Max Age"
                value={filters.ageMax}
                onChange={onFilterChange}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <input
              type="text"
              name="education"
              placeholder="Education"
              value={filters.education}
              onChange={onFilterChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
            <input
              type="text"
              name="occupation"
              placeholder="Occupation"
              value={filters.occupation}
              onChange={onFilterChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
            <select
              name="submittedBy"
              value={filters.submittedBy}
              onChange={onFilterChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              <option value="">All Submissions</option>
              <option value="Main Admin">Direct Clients</option>
              <option value="Partner Matchmaker">Partner Clients</option>
            </select>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onApply}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 active:from-emerald-600 active:to-teal-700 text-white px-4 py-2 rounded-lg transition-all shadow-md active:scale-95 text-sm"
            >
              Apply Filters
            </button>
            <button
              onClick={onClear}
              className="flex-1 bg-gray-500 active:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-sm active:scale-95"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
