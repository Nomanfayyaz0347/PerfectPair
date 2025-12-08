'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BottomNavigation from '@/components/BottomNavigation';
import ProfileSlider from '@/components/ProfileSlider';

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Show popup after 3 seconds
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/50 to-white flex flex-col">
      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[340px] overflow-hidden animate-slideUp">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-3 relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🤝</span>
                </div>
                <div className="text-left">
                  <h3 className="text-white font-bold text-sm">Client Access</h3>
                  <p className="text-teal-50 text-[10px]">Apne matches dekhein!</p>
                </div>
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all active:scale-95 flex-shrink-0"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-4 py-4">
              <p className="text-gray-700 text-xs leading-relaxed text-center mb-4">
                If you would like to get <span className="font-semibold text-teal-600">Client Access</span> or view your personalized <span className="font-semibold text-teal-600">matches</span>, simply contact us today.
              </p>

              {/* Benefits List */}
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-3 mb-3 border border-teal-100">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-teal-600 text-sm mt-0.5">💰</span>
                    <p className="text-[11px] text-gray-700 leading-relaxed">
                      <span className="font-semibold text-teal-600">Access Fee:</span> Only PKR 500
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-teal-600 text-sm mt-0.5">👀</span>
                    <p className="text-[11px] text-gray-700 leading-relaxed">
                      View your <span className="font-semibold">matches yourself</span> and shortlist the profiles you like
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-teal-600 text-sm mt-0.5">⚡</span>
                    <p className="text-[11px] text-gray-700 leading-relaxed">
                      <span className="font-semibold">Fast & Hassle-Free Process</span> – quick response and smooth experience
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-teal-600 text-sm mt-0.5">🎯</span>
                    <p className="text-[11px] text-gray-700 leading-relaxed">
                      Like a profile? Just <span className="font-semibold">inform us</span> and we will handle the next steps
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-teal-600 text-sm mt-0.5">🔒</span>
                    <p className="text-[11px] text-gray-700 leading-relaxed">
                      <span className="font-semibold">100% Secure, Private & Confidential</span> Service
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-2">
                <a
                  href="https://wa.me/923352762923?text=Hi,%20Main%20Client%20Access%20lena%20chahta%20hoon%20(500%20Rs)%20aur%20apne%20matches%20dekhna%20chahta%20hoon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-semibold text-[11px] transition-all active:scale-95 shadow-lg"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp Par Message Karein
                </a>

                <a
                  href="tel:+923352762923"
                  className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl font-semibold text-[11px] transition-all active:scale-95 shadow-lg"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Karein
                </a>
              </div>

            </div>
          </div>
        </div>
      )}

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
