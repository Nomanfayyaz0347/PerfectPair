'use client';

import Link from 'next/link';

export default function CompareButton() {
  return (
    <div className="mb-4">
      <Link
        href="/compare"
        className="flex items-center justify-center space-x-2 bg-blue-500 active:bg-blue-600 text-white px-4 py-2.5 rounded-lg transition-colors text-sm shadow-md active:scale-95 w-full"
      >
        <span>🔄</span>
        <span>Compare Profiles</span>
      </Link>
    </div>
  );
}
