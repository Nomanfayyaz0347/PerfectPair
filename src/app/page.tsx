import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Mobile Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-lg">💕</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">PerfectPair</h1>
            </div>
            
            {/* Mobile Actions */}
            <div className="flex items-center gap-2">
              <Link 
                href="/login" 
                className="text-gray-600 hover:text-emerald-600 p-2 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Mobile Only */}
      <main className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-20 right-10 w-32 h-32 bg-emerald-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 left-10 w-40 h-40 bg-teal-200 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-md mx-auto px-5 py-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 mb-6">
            <span className="text-emerald-600 text-sm">✨</span>
            <span className="text-emerald-700 text-xs font-semibold">Premium Matchmaking</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Find Your
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Perfect Match
            </span>
          </h2>

          <p className="text-base text-gray-600 mb-8 leading-relaxed">
            Connect with your perfect match through our trusted platform. Start your journey today!
          </p>
          
          {/* CTA Button */}
          <Link
            href="/form"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-4 rounded-2xl text-base font-semibold shadow-lg active:scale-95 transition-transform"
          >
            <span className="text-xl">💝</span>
            <span>Find My Match</span>
          </Link>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-12">
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-emerald-600 mb-1">500+</div>
              <div className="text-xs text-gray-600">Happy Couples</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-teal-600 mb-1">98%</div>
              <div className="text-xs text-gray-600">Success Rate</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-emerald-700 mb-1">24/7</div>
              <div className="text-xs text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section - Mobile */}
      <section className="bg-white py-12">
        <div className="max-w-md mx-auto px-5">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Why Choose 
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> PerfectPair?</span>
            </h3>
            <p className="text-sm text-gray-600">Experience premium matchmaking</p>
          </div>

          <div className="space-y-4">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-5 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-white text-xl">🎯</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">Smart Matching</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">Advanced algorithm finds your perfect match based on personality and interests.</p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-teal-50 to-white border border-teal-100 p-5 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-white text-xl">🔒</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">100% Secure</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">Your privacy is our priority. All data is encrypted and protected.</p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 p-5 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-white text-xl">⚡</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">Quick & Easy</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">Simple 5-minute profile setup with instant matches today!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Mobile */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-10">
        <div className="max-w-md mx-auto px-5">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">💕</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">PerfectPair</h3>
                <p className="text-gray-400 text-xs">Find Your Perfect Match</p>
              </div>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent mb-4"></div>
            <p className="text-gray-400 text-sm">
              © 2025 PerfectPair. All rights reserved.
              <br />
              Made with ❤️ for bringing souls together.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
