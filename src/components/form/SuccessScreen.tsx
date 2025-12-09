'use client';

import Link from 'next/link';

interface SuccessScreenProps {
  onCreateAnother: () => void;
}

export default function SuccessScreen({ onCreateAnother }: SuccessScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl shadow-sm p-8 text-center">
        <div className="text-6xl mb-6">✅</div>
        <h2 className="text-2xl text-gray-900 mb-4 heading">Profile Created Successfully!</h2>
        <p className="text-gray-600 mb-6 font-light">
          Thank you for creating your profile. Our team will review your information and contact you soon with potential matches.
        </p>
        <div className="space-y-4">
          <button
            onClick={onCreateAnother}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 px-4 rounded-lg transition-all font-light shadow-md hover:shadow-lg"
          >
            Create Another Profile
          </button>
          <Link
            href="/"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
