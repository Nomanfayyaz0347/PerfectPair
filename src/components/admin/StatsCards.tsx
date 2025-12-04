'use client';

import { Profile } from './types';

interface StatsCardsProps {
  profiles: Profile[];
}

export default function StatsCards({ profiles }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="bg-white rounded-lg shadow-md p-3">
        <div className="text-xl font-bold text-emerald-600">{profiles.length}</div>
        <div className="text-gray-600 text-xs">Total Profiles</div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-3">
        <div className="text-xl font-bold text-teal-600">
          {profiles.filter((p: Profile) => p.age >= 18 && p.age <= 25).length}
        </div>
        <div className="text-gray-600 text-xs">Young (18-25)</div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-3">
        <div className="text-xl font-bold text-emerald-500">
          {profiles.filter((p: Profile) => p.age >= 26 && p.age <= 35).length}
        </div>
        <div className="text-gray-600 text-xs">Adults (26-35)</div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-3">
        <div className="text-xl font-bold text-teal-500">
          {profiles.filter((p: Profile) => p.age > 35).length}
        </div>
        <div className="text-gray-600 text-xs">Mature (35+)</div>
      </div>
    </div>
  );
}
