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

          {/* Contact Section - Compact */}
          <div className="mb-6">
            <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-lg">📞</span> Contact Us
            </h2>
            
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-3 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🤝</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Get In Touch</h3>
                    <p className="text-teal-100 text-xs">We&apos;re here to help</p>
                  </div>
                </div>
              </div>
              
              {/* Contact Grid */}
              <div className="p-3 grid grid-cols-2 gap-2">
                {/* Phone */}
                <a href="tel:+923352762923" className="flex flex-col items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-xl p-3 active:scale-[0.97] transition-all">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">Call</span>
                </a>
                
                {/* WhatsApp */}
                <a href="https://wa.me/923352762923" target="_blank" className="flex flex-col items-center gap-1.5 bg-green-50 border border-green-100 rounded-xl p-3 active:scale-[0.97] transition-all">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">WhatsApp</span>
                </a>
                
                {/* Email */}
                <a href="mailto:info@perfectpair.pk" className="flex flex-col items-center gap-1.5 bg-rose-50 border border-rose-100 rounded-xl p-3 active:scale-[0.97] transition-all">
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">Email</span>
                </a>
                
                {/* Hours */}
                <div className="flex flex-col items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-xl p-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-white text-sm">🕐</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">9AM-8PM</span>
                </div>
              </div>
              
              {/* Phone Number */}
              <div className="px-3 pb-3">
                <div className="bg-gray-50 rounded-xl px-3 py-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">+92 335 2762923</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600">Online</span>
                  </div>
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