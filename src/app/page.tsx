import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/50 to-white flex flex-col">
      {/* Minimal Header */}
      <header className="px-5 pt-6 pb-4">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-200">
              <span className="text-xl">💕</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 tracking-tight">PerfectPair</h1>
              <p className="text-[10px] text-teal-600 font-medium -mt-0.5">Find Your Soulmate</p>
            </div>
          </div>
          <Link 
            href="/login" 
            className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center active:scale-95 transition-all shadow-sm"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto px-5 pb-24">
        <div className="max-w-lg mx-auto">
          
          {/* Hero Section */}
          <div className="mt-4 mb-8">
            <div className="relative">
              {/* Main Image/Illustration Area */}
              <div className="bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 rounded-[28px] p-8 relative overflow-hidden border border-teal-100/50">
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-teal-200/30 rounded-full blur-2xl"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-emerald-200/30 rounded-full blur-2xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-200/20 rounded-full blur-3xl"></div>
                
                {/* Floating Hearts */}
                <div className="absolute top-6 right-8 text-2xl animate-bounce" style={{animationDelay: '0s'}}>💚</div>
                <div className="absolute top-16 left-6 text-lg animate-bounce" style={{animationDelay: '0.5s'}}>💕</div>
                <div className="absolute bottom-8 right-12 text-xl animate-bounce" style={{animationDelay: '1s'}}>💗</div>
                
                {/* Center Content */}
                <div className="relative z-10 text-center py-6">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-teal-200/50">
                    <span className="text-5xl">👫</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Find Your Perfect Match</h2>
                  <p className="text-teal-600 text-sm font-medium">Trusted by 500+ happy couples</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href="/form"
              className="mt-5 w-full flex items-center justify-center gap-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-6 py-4 rounded-2xl text-base font-semibold shadow-lg shadow-teal-200/50 active:scale-[0.98] transition-all"
            >
              <span>Start Your Journey</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-white border border-teal-100 rounded-2xl p-4 text-center shadow-sm">
              <div className="text-2xl mb-1">💑</div>
              <div className="text-xl font-bold text-gray-800">500+</div>
              <div className="text-[10px] text-teal-600 font-medium">Couples</div>
            </div>
            <div className="bg-white border border-emerald-100 rounded-2xl p-4 text-center shadow-sm">
              <div className="text-2xl mb-1">✨</div>
              <div className="text-xl font-bold text-gray-800">98%</div>
              <div className="text-[10px] text-emerald-600 font-medium">Success</div>
            </div>
            <div className="bg-white border border-cyan-100 rounded-2xl p-4 text-center shadow-sm">
              <div className="text-2xl mb-1">🏆</div>
              <div className="text-xl font-bold text-gray-800">#1</div>
              <div className="text-[10px] text-cyan-600 font-medium">In Pakistan</div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Why Choose Us?</h3>
            
            <div className="space-y-3">
              {/* Feature 1 */}
              <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                  <span className="text-xl">🎯</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Smart Matching</h4>
                  <p className="text-xs text-gray-500">AI finds your perfect match</p>
                </div>
                <svg className="w-5 h-5 text-teal-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                  <span className="text-xl">✅</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Verified Profiles</h4>
                  <p className="text-xs text-gray-500">100% genuine members</p>
                </div>
                <svg className="w-5 h-5 text-emerald-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                  <span className="text-xl">🔒</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">100% Private</h4>
                  <p className="text-xs text-gray-500">Your data is safe with us</p>
                </div>
                <svg className="w-5 h-5 text-cyan-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Feature 4 */}
              <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-sky-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                  <span className="text-xl">💬</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">24/7 Support</h4>
                  <p className="text-xs text-gray-500">Always here to help you</p>
                </div>
                <svg className="w-5 h-5 text-sky-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">How It Works</h3>
            
            <div className="relative">
              {/* Connection Line */}
              <div className="absolute left-6 top-14 bottom-14 w-0.5 bg-gradient-to-b from-teal-300 via-emerald-300 to-teal-300"></div>
              
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex items-center gap-4 relative">
                  <div className="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-lg shadow-teal-200/50 z-10">1</div>
                  <div className="flex-1 bg-teal-50 border border-teal-100 rounded-2xl p-4">
                    <h4 className="font-semibold text-gray-800 text-sm">Create Your Profile</h4>
                    <p className="text-xs text-gray-500">Fill in your details & preferences</p>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="flex items-center gap-4 relative">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-lg shadow-emerald-200/50 z-10">2</div>
                  <div className="flex-1 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                    <h4 className="font-semibold text-gray-800 text-sm">Get Perfect Matches</h4>
                    <p className="text-xs text-gray-500">Receive compatible profiles daily</p>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="flex items-center gap-4 relative">
                  <div className="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-lg shadow-teal-200/50 z-10">3</div>
                  <div className="flex-1 bg-teal-50 border border-teal-100 rounded-2xl p-4">
                    <h4 className="font-semibold text-gray-800 text-sm">Connect & Meet</h4>
                    <p className="text-xs text-gray-500">Start your beautiful journey together</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="mb-8">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm relative overflow-hidden">
              {/* Decorative */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100/50 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              
              <div className="relative z-10">
                {/* Quote Icon */}
                <div className="text-teal-400 text-4xl mb-3 opacity-50">"</div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-5">
                  PerfectPair helped me find my soulmate. Within just 2 months, I met my perfect match. The team was so supportive throughout our journey!
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-lg">👩‍❤️‍👨</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">Ahmed & Sara</div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-amber-400 text-xs">⭐</span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-auto text-xs text-teal-600 font-medium">Married 2024</div>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center pb-4">
            <p className="text-gray-400 text-xs mb-3">Ready to find your perfect match?</p>
            <Link
              href="/form"
              className="inline-flex items-center gap-2 text-teal-600 font-semibold text-sm"
            >
              <span>Get Started Now</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      {/* Bottom Navigation - iOS Style */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 safe-area-bottom z-50">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            <Link href="/" className="flex flex-col items-center py-2 px-4 text-teal-600">
              <div className="relative">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-teal-500 rounded-full"></div>
              </div>
              <span className="text-[10px] font-semibold mt-1">Home</span>
            </Link>
            
            <Link href="/about" className="flex flex-col items-center py-2 px-4 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[10px] font-medium mt-1">About</span>
            </Link>
            
            {/* Center FAB Button */}
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
