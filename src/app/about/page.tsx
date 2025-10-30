import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-4">
              <div className="text-3xl">💕</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MatchMaker</h1>
                <p className="text-sm text-gray-600">Find Your Perfect Match</p>
              </div>
            </Link>
            <Link
              href="/login"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">About MatchMaker</h1>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              MatchMaker is dedicated to helping individuals find their perfect life partner through our comprehensive 
              and personalized matchmaking service. We understand that finding the right person is one of life&apos;s most 
              important journeys, and we&apos;re here to make that journey meaningful and successful.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="font-semibold mb-2">Create Profile</h3>
                <p className="text-gray-600 text-sm">Fill out our comprehensive form with your personal details and partner preferences.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="font-semibold mb-2">Smart Matching</h3>
                <p className="text-gray-600 text-sm">Our advanced algorithm finds compatible matches based on your requirements.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💕</span>
                </div>
                <h3 className="font-semibold mb-2">Connect</h3>
                <p className="text-gray-600 text-sm">We facilitate introductions and help you connect with potential matches.</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Services</h2>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li>Comprehensive profile creation and verification</li>
              <li>Advanced matching algorithm based on compatibility factors</li>
              <li>Professional consultation and guidance</li>
              <li>Privacy protection and secure data handling</li>
              <li>Personalized matchmaking recommendations</li>
              <li>24/7 customer support</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose MatchMaker?</h2>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg mb-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span><strong>Personalized Approach:</strong> We understand that every individual is unique, and so are their preferences.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span><strong>Verified Profiles:</strong> All profiles undergo verification to ensure authenticity and reliability.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span><strong>Advanced Matching:</strong> Our smart algorithm considers multiple compatibility factors.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span><strong>Privacy First:</strong> Your personal information is protected with industry-standard security.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span><strong>Success Stories:</strong> We have helped thousands of people find their life partners.</span>
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-4">
                Ready to start your journey towards finding your perfect match? Get in touch with us today!
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> info@matchmaker.com</p>
                <p><strong>Phone:</strong> +92 300 1234567</p>
                <p><strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM</p>
                <p><strong>Address:</strong> Main Office, City Center, Pakistan</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/form"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors mr-4"
            >
              Create Your Profile
            </Link>
            <Link
              href="/"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="text-2xl">💕</div>
              <div>
                <h3 className="text-xl font-bold">MatchMaker</h3>
                <p className="text-gray-400">Find Your Perfect Match</p>
              </div>
            </div>
            <p className="text-gray-400">
              © 2025 MatchMaker. All rights reserved. Made with ❤️ for bringing people together.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}