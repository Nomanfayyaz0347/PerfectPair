import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-100">
      {/* Mobile-First Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            {/* Logo - Mobile Optimized */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm sm:text-lg">💕</span>
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-black bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent">
                PerfectPair
              </h1>
            </div>
            
            {/* Mobile Navigation */}
            <nav className="flex items-center space-x-1 sm:space-x-3">
              <Link href="/" className="hidden sm:inline-block text-gray-600 hover:text-pink-600 px-3 py-2 rounded-full hover:bg-pink-50 transition-all text-sm font-medium">Home</Link>
              <Link href="/form" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full hover:shadow-lg transition-all text-xs sm:text-sm font-medium touch-manipulation">
                <span className="hidden sm:inline">Join Now</span>
                <span className="sm:hidden">Join</span>
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-purple-600 px-2 py-2 sm:px-3 rounded-full hover:bg-purple-50 transition-all text-xs sm:text-sm font-medium touch-manipulation">
                <span className="hidden sm:inline">Admin</span>
                <span className="sm:hidden">👤</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Modern Design */}
      <main className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100/50 to-purple-100/50">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%), 
                             radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 40% 80%, rgba(244, 114, 182, 0.1) 0%, transparent 50%)`
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-3 py-12 sm:px-6 sm:py-20 lg:px-8">
          <div className="text-center">
            {/* Mobile-First Heading */}
            <div className="mb-6 sm:mb-8 px-4 sm:px-0">
              <span className="inline-block text-xs sm:text-sm font-semibold text-pink-600 bg-pink-50 px-3 py-1 sm:px-4 sm:py-2 rounded-full mb-4">
                ✨ Premium Matchmaking
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-6xl xl:text-7xl font-black text-gray-900 mb-4 leading-tight">
                Where Hearts
                <br />
                <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent">
                  Find Home
                </span>
              </h2>
            </div>

            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-8 sm:mb-12 max-w-xl sm:max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
              Connect with your perfect match through our trusted platform. 
              <span className="hidden sm:inline"><br />Join thousands of successful couples who found love here.</span>
              <span className="sm:hidden"> Start your journey today!</span>
            </p>
            
            {/* Mobile-First CTA Buttons */}
            <div className="flex flex-col gap-3 sm:gap-4 justify-center items-center max-w-xs sm:max-w-md mx-auto px-4 sm:px-0">
              <Link
                href="/form"
                className="group relative w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 touch-manipulation overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <span className="mr-2 text-sm sm:text-base">💝</span>
                  <span className="text-sm sm:text-base">Start Your Journey</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                href="/login"
                className="w-full bg-white text-gray-700 px-6 py-3 sm:px-8 sm:py-4 rounded-full text-sm sm:text-lg font-semibold border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-all duration-300 touch-manipulation"
              >
                Admin Panel
              </Link>
            </div>

            {/* Mobile-Optimized Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-6 mt-10 sm:mt-16 max-w-sm sm:max-w-md mx-auto px-4 sm:px-0">
              <div className="text-center bg-white/50 rounded-xl p-3 sm:p-4">
                <div className="text-lg sm:text-2xl lg:text-3xl font-black text-pink-600 mb-1">500+</div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">Happy<br className="sm:hidden" /> Couples</div>
              </div>
              <div className="text-center bg-white/50 rounded-xl p-3 sm:p-4">
                <div className="text-lg sm:text-2xl lg:text-3xl font-black text-purple-600 mb-1">98%</div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">Success<br className="sm:hidden" /> Rate</div>
              </div>
              <div className="text-center bg-white/50 rounded-xl p-3 sm:p-4">
                <div className="text-lg sm:text-2xl lg:text-3xl font-black text-rose-600 mb-1">24/7</div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">Support</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile-First Features Section */}
      <section className="relative py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 mb-3 sm:mb-4 px-4">
              Why Choose 
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"> PerfectPair?</span>
            </h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto px-4">Experience the future of matchmaking with our innovative features</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="group bg-gradient-to-br from-pink-50 to-rose-50 p-6 sm:p-8 rounded-2xl border border-pink-100 hover:border-pink-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl sm:text-2xl">🎯</span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Smart Matching</h4>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Advanced AI algorithm that finds your perfect match based on personality and interests.</p>
            </div>

            <div className="group bg-gradient-to-br from-purple-50 to-indigo-50 p-6 sm:p-8 rounded-2xl border border-purple-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl sm:text-2xl">🔒</span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">100% Secure</h4>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Your privacy is our priority. All data is encrypted and protected with enterprise-level security.</p>
            </div>

            <div className="group bg-gradient-to-br from-amber-50 to-orange-50 p-6 sm:p-8 rounded-2xl border border-amber-100 hover:border-amber-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl sm:text-2xl">⚡</span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Quick & Easy</h4>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Simple 5-minute profile setup with instant matches. Start your journey to love today!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 text-white">
        <div className="max-w-7xl mx-auto px-3 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">💕</span>
              </div>
              <div>
                <h3 className="text-2xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">PerfectPair</h3>
                <p className="text-gray-300 text-sm">Where Hearts Find Home</p>
              </div>
            </div>
            <div className="w-24 h-px bg-gradient-to-r from-pink-500 to-purple-600 mx-auto mb-6"></div>
            <p className="text-gray-300">
              © 2025 PerfectPair. All rights reserved. Made with 💝 for bringing souls together.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
