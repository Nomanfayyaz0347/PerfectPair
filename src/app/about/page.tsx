import Link from 'next/link';
import BottomNavigation from '@/components/BottomNavigation';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/50 to-white flex flex-col">
      {/* Header */}
      <header className="px-5 pt-6 pb-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-200">
              <span className="text-lg">💕</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-800 tracking-tight">PerfectPair</h1>
              <p className="text-[9px] text-teal-600 font-medium -mt-0.5">Find Your Soulmate</p>
            </div>
          </Link>
          <Link 
            href="/login" 
            className="px-3 py-1.5 bg-teal-500 text-white text-xs font-semibold rounded-xl active:scale-95 transition-all shadow-md shadow-teal-200"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto px-5 pb-28">
        <div className="max-w-lg mx-auto py-6">
          
          {/* Hero Section */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-3 border border-teal-200/50">
              <span className="text-3xl">💕</span>
            </div>
            <h1 className="text-lg font-bold text-gray-800 mb-1">About PerfectPair</h1>
            <p className="text-teal-600 text-xs font-medium">Your trusted matchmaking partner</p>
          </div>

          {/* Mission Card */}
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-4 mb-5 border border-teal-100/50">
            <h2 className="text-base font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span className="text-lg">🎯</span> Our Mission
            </h2>
            <p className="text-gray-600 text-xs leading-relaxed">
              PerfectPair is dedicated to helping individuals find their perfect life partner through our 
              comprehensive and personalized matchmaking service. We understand that finding the right 
              person is one of life&apos;s most important journeys.
            </p>
          </div>

          {/* How It Works */}
          <div className="mb-5">
            <h2 className="text-base font-bold text-gray-800 mb-3">How It Works</h2>
            
            <div className="relative">
              <div className="absolute left-5 top-10 bottom-10 w-0.5 bg-gradient-to-b from-teal-300 via-emerald-300 to-teal-300"></div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 relative">
                  <div className="w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-lg shadow-teal-200/50 z-10">1</div>
                  <div className="flex-1 bg-white border border-teal-100 rounded-2xl p-3 shadow-sm">
                    <h4 className="text-xs font-semibold text-gray-800">Create Profile</h4>
                    <p className="text-[10px] text-gray-500">Fill your details & preferences</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 relative">
                  <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-lg shadow-emerald-200/50 z-10">2</div>
                  <div className="flex-1 bg-white border border-emerald-100 rounded-2xl p-3 shadow-sm">
                    <h4 className="text-xs font-semibold text-gray-800">Smart Matching</h4>
                    <p className="text-[10px] text-gray-500">We find compatible matches for you</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 relative">
                  <div className="w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-lg shadow-teal-200/50 z-10">3</div>
                  <div className="flex-1 bg-white border border-teal-100 rounded-2xl p-3 shadow-sm">
                    <h4 className="text-xs font-semibold text-gray-800">Connect & Meet</h4>
                    <p className="text-[10px] text-gray-500">Start your beautiful journey</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="mb-5">
            <h2 className="text-base font-bold text-gray-800 mb-3">Why Choose Us?</h2>
            
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 bg-white border border-gray-100 rounded-2xl p-3 shadow-sm">
                <div className="w-9 h-9 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-base">✅</span>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-800">Verified Profiles</h4>
                  <p className="text-[10px] text-gray-500">100% genuine & authentic</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5 bg-white border border-gray-100 rounded-2xl p-3 shadow-sm">
                <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-base">🔒</span>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-800">Privacy Protected</h4>
                  <p className="text-[10px] text-gray-500">Your data is 100% secure</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5 bg-white border border-gray-100 rounded-2xl p-3 shadow-sm">
                <div className="w-9 h-9 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-base">🎯</span>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-800">Smart Algorithm</h4>
                  <p className="text-[10px] text-gray-500">AI-powered matching</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5 bg-white border border-gray-100 rounded-2xl p-3 shadow-sm">
                <div className="w-9 h-9 bg-sky-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-base">💬</span>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-800">24/7 Support</h4>
                  <p className="text-[10px] text-gray-500">Always here to help</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section - Compact */}
          <div className="mb-5">
            <h2 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span className="text-base">📞</span> Contact Us
            </h2>
            
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-3 py-2 text-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-lg">🤝</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xs">Get In Touch</h3>
                    <p className="text-teal-100 text-[10px]">We&apos;re here to help</p>
                  </div>
                </div>
              </div>
              
              {/* Contact Grid */}
              <div className="p-2.5 grid grid-cols-2 gap-2">
                {/* Phone */}
                <a href="tel:+923352762923" className="flex flex-col items-center gap-1 bg-blue-50 border border-blue-100 rounded-xl p-2.5 active:scale-[0.97] transition-all">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">Call</span>
                </a>
                
                {/* WhatsApp */}
                <a href="https://wa.me/923352762923" target="_blank" className="flex flex-col items-center gap-1 bg-green-50 border border-green-100 rounded-xl p-2.5 active:scale-[0.97] transition-all">
                  <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">WhatsApp</span>
                </a>
                
                {/* Email */}
                <a href="mailto:info@perfectpair.pk" className="flex flex-col items-center gap-1 bg-rose-50 border border-rose-100 rounded-xl p-2.5 active:scale-[0.97] transition-all">
                  <div className="w-9 h-9 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">Email</span>
                </a>
                
                {/* Hours */}
                <div className="flex flex-col items-center gap-1 bg-amber-50 border border-amber-100 rounded-xl p-2.5">
                  <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-white text-xs">🕐</span>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-700">9AM-8PM</span>
                </div>
              </div>
              
              {/* Phone Number */}
              <div className="px-2.5 pb-2.5">
                <div className="bg-gray-50 rounded-xl px-2.5 py-1.5 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">+92 335 2762923</span>
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
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-5 py-3 rounded-2xl text-sm font-semibold shadow-lg shadow-teal-200/50 active:scale-[0.98] transition-all"
          >
            <span>Create Your Profile</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}