import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/50">
      {/* Mobile-First Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            {/* Logo - Mobile Optimized */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white text-sm sm:text-lg">💕</span>
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl text-gray-900 tracking-wide heading">
                PerfectPair
              </h1>
            </div>
            
            {/* Mobile Navigation */}
            <nav className="flex items-center space-x-1 sm:space-x-3">
              <Link href="/" className="hidden sm:inline-block text-gray-600 hover:text-emerald-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all text-sm font-light tracking-wide">Home</Link>
              <Link href="/form" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full hover:shadow-md hover:from-emerald-600 hover:to-teal-600 transition-all text-xs sm:text-sm font-light tracking-wide touch-manipulation">
                <span className="hidden sm:inline">Join Now</span>
                <span className="sm:hidden">Join</span>
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-teal-600 px-2 py-2 sm:px-3 rounded-lg hover:bg-gray-50 transition-all text-xs sm:text-sm font-light tracking-wide touch-manipulation">
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
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/20 to-teal-50/20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 50%), 
                             radial-gradient(circle at 80% 20%, rgba(20, 184, 166, 0.05) 0%, transparent 50%),
                             radial-gradient(circle at 40% 80%, rgba(52, 211, 153, 0.05) 0%, transparent 50%)`
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-3 py-12 sm:px-6 sm:py-20 lg:px-8">
          <div className="text-left">
            {/* Mobile-First Heading */}
            <div className="mb-6 sm:mb-8 px-4 sm:px-0">
              <span className=" inline-block text-xs sm:text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 sm:px-4 sm:py-2 rounded-full mb-4 tracking-wide">
                ✨ Premium Matchmaking
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-6xl xl:text-7xl text-gray-900 mb-4 leading-tight tracking-wide heading">
                Find Your
                <br />
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Perfect Match
                </span>
              </h2>
            </div>

            <p className="text-sm sm:text-base lg:text-lg font-light text-gray-600 mb-8 sm:mb-12 max-w-xl sm:max-w-2xl mx-auto leading-relaxed px-4 sm:px-0 tracking-wide">
              Connect with your perfect match through our trusted platform. 
              <span className="hidden sm:inline"><br />Join thousands of successful couples who found love here.</span>
              <span className="sm:hidden"> Start your journey today!</span>
            </p>
            
            {/* Mobile-First CTA Buttons */}
            <div className="flex flex-col gap-3 sm:gap-4 justify-center items-center max-w-xs sm:max-w-md mx-auto px-4 sm:px-0">
              <Link
                href="/form"
                className="group relative w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 touch-manipulation"
              >
                <span className="flex items-center justify-center">
                  <span className="mr-2 text-sm sm:text-base">💝</span>
                  <span className="text-sm sm:text-base font-light tracking-wide">Find My Match</span>
                </span>
              </Link>
            </div>

            {/* Mobile-Optimized Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-6 mt-10 sm:mt-16 max-w-sm sm:max-w-md mx-auto px-4 sm:px-0">
              <div className="text-center bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl p-3 sm:p-4 shadow-sm">
                <div className="text-lg sm:text-2xl lg:text-3xl text-emerald-600 mb-1 heading">500+</div>
                <div className="text-xs sm:text-sm font-light text-gray-600 leading-tight tracking-wide">Happy<br className="sm:hidden" /> Couples</div>
              </div>
              <div className="text-center bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl p-3 sm:p-4 shadow-sm">
                <div className="text-lg sm:text-2xl lg:text-3xl text-teal-600 mb-1 heading">98%</div>
                <div className="text-xs sm:text-sm font-light text-gray-600 leading-tight tracking-wide">Success<br className="sm:hidden" /> Rate</div>
              </div>
              <div className="text-center bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl p-3 sm:p-4 shadow-sm">
                <div className="text-lg sm:text-2xl lg:text-3xl text-emerald-700 mb-1 heading">24/7</div>
                <div className="text-xs sm:text-sm font-light text-gray-600 leading-tight tracking-wide">Support</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile-First Features Section */}
      <section className="relative py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className=" mb-8 sm:mb-12">
            <h3 className="text-xl sm:text-2xl lg:text-3xl text-gray-900 mb-3 sm:mb-4 px-4 tracking-wide heading">
              Why Choose 
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> PerfectPair?</span>
            </h3>
            <p className="text-sm sm:text-base font-light text-gray-600 max-w-xl mx-auto px-4 tracking-wide">Experience the future of matchmaking with our innovative features</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="group bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-sm">
                <span className="text-white text-xl sm:text-2xl">🎯</span>
              </div>
              <h4 className="text-lg sm:text-xl text-gray-900 mb-2 sm:mb-3 tracking-wide heading">Smart Matching</h4>
              <p className="text-sm sm:text-base font-light text-gray-600 leading-relaxed tracking-wide">Advanced algorithm that finds your perfect match based on personality and interests.</p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-teal-400 to-teal-500 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-sm">
                <span className="text-white text-xl sm:text-2xl">🔒</span>
              </div>
              <h4 className="text-lg sm:text-xl text-gray-900 mb-2 sm:mb-3 tracking-wide heading">100% Secure</h4>
              <p className="text-sm sm:text-base font-light text-gray-600 leading-relaxed tracking-wide">Your privacy is our priority. All data is encrypted and protected with enterprise-level security.</p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-sm">
                <span className="text-white text-xl sm:text-2xl">⚡</span>
              </div>
              <h4 className="text-lg sm:text-xl text-gray-900 mb-2 sm:mb-3 tracking-wide heading">Quick & Easy</h4>
              <p className="text-sm sm:text-base font-light text-gray-600 leading-relaxed tracking-wide">Simple 5-minute profile setup with instant matches. Start your journey to love today!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-3 py-12 sm:px-6 lg:px-8">
          <div className="text-left">
            <div className="flex items-center justify-left space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">💕</span>
              </div>
              <div>
                <h3 className="text-2xl text-white tracking-wide heading text-left">PerfectPair</h3>
                <p className="text-gray-300 text-sm font-light tracking-wide">Find Your Perfect Match</p>
              </div>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mb-6"></div>
            <p className="text-gray-300 font-light tracking-wide">
              © 2025 PerfectPair. All rights reserved. Made with ❤️ for bringing souls together.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
