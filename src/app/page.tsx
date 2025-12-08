import Link from 'next/link';
import BottomNavigation from '@/components/BottomNavigation';
import ProfileSlider from '@/components/ProfileSlider';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/50 to-white flex flex-col">
      {/* Minimal Header */}
      <header className="px-5 pt-6 pb-4">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-200">
              <span className="text-lg">💕</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-800 tracking-tight">PerfectPair</h1>
              <p className="text-[9px] text-teal-600 font-medium -mt-0.5">Find Your Soulmate</p>
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
                  <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-teal-200/50">
                    <span className="text-4xl">👫</span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-800 mb-1.5">Find Your Perfect Match</h2>
                  <p className="text-teal-600 text-xs font-medium">Trusted by 500+ happy couples</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href="/form"
              className="mt-5 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-5 py-3 rounded-2xl text-sm font-semibold shadow-lg shadow-teal-200/50 active:scale-[0.98] transition-all"
            >
              <span>Start Your Journey</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
 {/* Profile Slider Section */}
          <ProfileSlider />
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2 mb-8">
            <div className="bg-white border border-teal-100 rounded-2xl p-3 text-center shadow-sm">
              <div className="text-xl mb-0.5">💑</div>
              <div className="text-base font-bold text-gray-800">500+</div>
              <div className="text-[9px] text-teal-600 font-medium">Couples</div>
            </div>
            <div className="bg-white border border-emerald-100 rounded-2xl p-3 text-center shadow-sm">
              <div className="text-xl mb-0.5">✨</div>
              <div className="text-base font-bold text-gray-800">98%</div>
              <div className="text-[9px] text-emerald-600 font-medium">Success</div>
            </div>
            <div className="bg-white border border-cyan-100 rounded-2xl p-3 text-center shadow-sm">
              <div className="text-xl mb-0.5">🏆</div>
              <div className="text-base font-bold text-gray-800">#1</div>
              <div className="text-[9px] text-cyan-600 font-medium">In Pakistan</div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-8">
            <h3 className="text-base font-bold text-gray-800 mb-3">Why Choose Us?</h3>
            
            <div className="space-y-2.5">
              {/* Feature 1 */}
              <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-3 shadow-sm">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                  <span className="text-lg">🎯</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">Smart Matching</h4>
                  <p className="text-[10px] text-gray-500">AI finds your perfect match</p>
                </div>
                <svg className="w-5 h-5 text-teal-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-3 shadow-sm">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                  <span className="text-lg">✅</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">Verified Profiles</h4>
                  <p className="text-[10px] text-gray-500">100% genuine members</p>
                </div>
                <svg className="w-5 h-5 text-emerald-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-3 shadow-sm">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                  <span className="text-lg">🔒</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">100% Private</h4>
                  <p className="text-[10px] text-gray-500">Your data is safe with us</p>
                </div>
                <svg className="w-5 h-5 text-cyan-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Feature 4 */}
              <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-3 shadow-sm">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                  <span className="text-lg">💬</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">24/7 Support</h4>
                  <p className="text-[10px] text-gray-500">Always here to help you</p>
                </div>
                <svg className="w-5 h-5 text-sky-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

         

          {/* How It Works */}
          <div className="mb-8 mt-16">
            <h3 className="text-base font-bold text-gray-800 mb-3">How It Works</h3>
            
            <div className="relative">
              {/* Connection Line */}
              <div className="absolute left-5 top-12 bottom-12 w-0.5 bg-gradient-to-b from-teal-300 via-emerald-300 to-teal-300"></div>
              
              <div className="space-y-3">
                {/* Step 1 */}
                <div className="flex items-center gap-3 relative">
                  <div className="w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-lg shadow-teal-200/50 z-10">1</div>
                  <div className="flex-1 bg-teal-50 border border-teal-100 rounded-2xl p-3">
                    <h4 className="text-xs font-semibold text-gray-800">Create Your Profile</h4>
                    <p className="text-[10px] text-gray-500">Fill in your details & preferences</p>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="flex items-center gap-3 relative">
                  <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-lg shadow-emerald-200/50 z-10">2</div>
                  <div className="flex-1 bg-emerald-50 border border-emerald-100 rounded-2xl p-3">
                    <h4 className="text-xs font-semibold text-gray-800">Get Perfect Matches</h4>
                    <p className="text-[10px] text-gray-500">Receive compatible profiles daily</p>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="flex items-center gap-3 relative">
                  <div className="w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-lg shadow-teal-200/50 z-10">3</div>
                  <div className="flex-1 bg-teal-50 border border-teal-100 rounded-2xl p-3">
                    <h4 className="text-xs font-semibold text-gray-800">Connect & Meet</h4>
                    <p className="text-[10px] text-gray-500">Start your beautiful journey together</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="mb-8">
            <div className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm relative overflow-hidden">
              {/* Decorative */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100/50 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              
              <div className="relative z-10">
                {/* Quote Icon */}
                <div className="text-teal-400 text-3xl mb-2 opacity-50">"</div>
                
                <p className="text-gray-600 text-xs leading-relaxed mb-4">
                  PerfectPair helped me find my soulmate. Within just 2 months, I met my perfect match. The team was so supportive throughout our journey!
                </p>
                
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-base">👩‍❤️‍👨</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-xs">Ahmed & Sara</div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-amber-400 text-[10px]">⭐</span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-auto text-[10px] text-teal-600 font-medium">Married 2024</div>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center pb-4">
            <p className="text-gray-400 text-[10px] mb-2">Ready to find your perfect match?</p>
            <Link
              href="/form"
              className="inline-flex items-center gap-1.5 text-teal-600 font-semibold text-xs"
            >
              <span>Get Started Now</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
