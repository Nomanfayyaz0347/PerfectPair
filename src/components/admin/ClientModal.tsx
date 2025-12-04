'use client';

interface ClientModalProps {
  isOpen: boolean;
  formData: {
    name: string;
    email: string;
    password: string;
  };
  message: { type: 'success' | 'error'; text: string } | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFormChange: (field: 'name' | 'email' | 'password', value: string) => void;
}

export default function ClientModal({
  isOpen,
  formData,
  message,
  onClose,
  onSubmit,
  onFormChange,
}: ClientModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full p-4 sm:p-6 mx-2">
        <div className="mb-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <span className="text-purple-600 text-xl sm:text-2xl">👤</span>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 text-center">Create Client Access</h3>
          <p className="text-xs sm:text-sm text-gray-600 text-center mb-4">
            Give your client login credentials to view their matches (without contact numbers)
          </p>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Client Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onFormChange('name', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Email (Login ID)
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onFormChange('email', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
              placeholder="client@example.com"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="text"
              value={formData.password}
              onChange={(e) => onFormChange('password', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
              minLength={6}
              placeholder="Minimum 6 characters"
            />
            <p className="text-xs text-gray-500 mt-1">Share this password with your client</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <p className="text-xs text-purple-800">
              <strong>Note:</strong> Client will be able to view their profile and matches, but contact numbers will be hidden for privacy.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 px-3 py-2.5 sm:px-4 sm:py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:flex-1 px-3 py-2.5 sm:px-4 sm:py-2 text-sm bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all"
            >
              Create Client Access
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
