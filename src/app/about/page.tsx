import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/50 to-white flex flex-col">
      {/* Header */}
      <header className="px-5 pt-6 pb-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-11 h-11 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-200">
              <span className="text-xl">💕</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 tracking-tight">PerfectPair</h1>
              <p className="text-[10px] text-teal-600 font-medium -mt-0.5">Find Your Soulmate</p>
            </div>
          </Link>
          <Link 
            href="/login" 
            className="px-4 py-2 bg-teal-500 text-white text-sm font-semibold rounded-xl active:scale-95 transition-all shadow-md shadow-teal-200"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto px-5 pb-28">
        <div className="max-w-lg mx-auto py-6">
          
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-teal-200/50">
              <span className="text-4xl">💕</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">About PerfectPair</h1>
            <p className="text-teal-600 text-sm font-medium">Your trusted matchmaking partner</p>
          </div>

          {/* Mission Card */}
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-5 mb-6 border border-teal-100/50">
            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-xl">🎯</span> Our Mission
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              PerfectPair is dedicated to helping individuals find their perfect life partner through our 
              comprehensive and personalized matchmaking service. We understand that finding the right 
              person is one of life&apos;s most important journeys.
            </p>
          </div>

          {/* How It Works */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">How It Works</h2>
            
            <div className="relative">
              <div className="absolute left-6 top-12 bottom-12 w-0.5 bg-gradient-to-b from-teal-300 via-emerald-300 to-teal-300"></div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 relative">
                  <div className="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-lg shadow-teal-200/50 z-10">1</div>
                  <div className="flex-1 bg-white border border-teal-100 rounded-2xl p-4 shadow-sm">
                    <h4 className="font-semibold text-gray-800 text-sm">Create Profile</h4>
                    <p className="text-xs text-gray-500">Fill your details & preferences</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 relative">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-lg shadow-emerald-200/50 z-10">2</div>
                  <div className="flex-1 bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm">
                    <h4 className="font-semibold text-gray-800 text-sm">Smart Matching</h4>
                    <p className="text-xs text-gray-500">We find compatible matches for you</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 relative">
                  <div className="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-lg shadow-teal-200/50 z-10">3</div>
                  <div className="flex-1 bg-white border border-teal-100 rounded-2xl p-4 shadow-sm">
                    <h4 className="font-semibold text-gray-800 text-sm">Connect & Meet</h4>
                    <p className="text-xs text-gray-500">Start your beautiful journey</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Why Choose Us?</h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">✅</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">Verified Profiles</h4>
                  <p className="text-xs text-gray-500">100% genuine & authentic</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🔒</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">Privacy Protected</h4>
                  <p className="text-xs text-gray-500">Your data is 100% secure</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🎯</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">Smart Algorithm</h4>
                  <p className="text-xs text-gray-500">AI-powered matching</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">💬</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">24/7 Support</h4>
                  <p className="text-xs text-gray-500">Always here to help</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-6 text-white mb-6 shadow-lg shadow-teal-200/50">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="text-xl">📞</span> Contact Us
            </h2>
            
            <div className="space-y-4">
              {/* Phone */}
              <a 
                href="tel:+923352762923" 
                className="flex items-center gap-4 bg-white/15 rounded-xl p-4 active:bg-white/25 transition-colors"
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-xl">📞</span>
                </div>
                <div>
                  <p className="text-xs text-teal-100">Phone Number</p>
                  <p className="font-semibold">+92 335 2762923</p>
                </div>
              </a>
              
              {/* WhatsApp */}
              <a 
                href="https://wa.me/923352762923" 
                target="_blank"
                className="flex items-center gap-4 bg-green-500 rounded-xl p-4 active:bg-green-600 transition-colors shadow-md"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <div>
                  <p className="text-xs text-green-100">Chat on WhatsApp</p>
                  <p className="font-semibold">+92 335 2762923</p>
                </div>
                <svg className="w-5 h-5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              
              {/* Email */}
              <a 
                href="mailto:info@perfectpair.pk" 
                className="flex items-center gap-4 bg-white/15 rounded-xl p-4 active:bg-white/25 transition-colors"
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-xl">✉️</span>
                </div>
                <div>
                  <p className="text-xs text-teal-100">Email</p>
                  <p className="font-semibold">info@perfectpair.pk</p>
                </div>
              </a>
              
              {/* Office Hours */}
              <div className="flex items-center gap-4 bg-white/15 rounded-xl p-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🕐</span>
                </div>
                <div>
                  <p className="text-xs text-teal-100">Office Hours</p>
                  <p className="font-semibold text-sm">Mon - Sat, 9:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/form"
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-6 py-4 rounded-2xl text-base font-semibold shadow-lg shadow-teal-200/50 active:scale-[0.98] transition-all"
          >
            <span>Create Your Profile</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 safe-area-bottom z-50">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            <Link href="/" className="flex flex-col items-center py-2 px-4 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-[10px] font-medium mt-1">Home</span>
            </Link>
            
            <Link href="/about" className="flex flex-col items-center py-2 px-4 text-teal-600">
              <div className="relative">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-teal-500 rounded-full"></div>
              </div>
              <span className="text-[10px] font-semibold mt-1">About</span>
            </Link>
            
            <Link href="/form" className="relative -top-5">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-teal-300/50 active:scale-95 transition-transform rotate-3 hover:rotate-0">
                <span className="text-3xl">💝</span>
              </div>
            </Link>
            
            <Link href="/form" className="flex flex-col items-center py-2 px-4 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-[10px] font-medium mt-1">Register</span>
            </Link>
            
            <Link href="/login" className="flex flex-col items-center py-2 px-4 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-[10px] font-medium mt-1">Login</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}