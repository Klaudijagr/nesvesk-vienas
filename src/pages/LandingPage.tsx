import { useConvexAuth } from 'convex/react';
import { ArrowRight, Calendar, Heart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LandingPage() {
  const { isAuthenticated } = useConvexAuth();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="relative bg-green-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544979590-2c5b3641b633?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              This Christmas,
              <br />
              <span className="text-amber-400">Nešvęsk Vienas.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 leading-relaxed">
              The holidays are meant for connection. Whether you have an empty seat at your table or
              are looking for a place to belong, join Lithuania's community for sharing the festive
              spirit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={isAuthenticated ? '/register?role=host' : '/login?redirect=/register?role=host'}
                className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-base font-bold rounded-full text-green-800 bg-amber-400 hover:bg-yellow-400 md:text-lg transition-transform hover:scale-105 shadow-lg"
              >
                Become a Host
              </Link>
              <Link
                to="/browse"
                className="inline-flex justify-center items-center px-8 py-4 border-2 border-white text-base font-bold rounded-full text-white hover:bg-white hover:text-green-800 md:text-lg transition-colors"
              >
                Find Company
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Safe, simple, and meaningful connections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Create a Profile</h3>
              <p className="text-gray-500">
                Sign up as a Host or Guest. Share your preferences, languages, and dietary needs.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-green-700" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Find a Match</h3>
              <p className="text-gray-500">
                Browse listings by city, age, and language. Send an invitation or request to join.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Celebrate Together</h3>
              <p className="text-gray-500">
                Once matched, connect safely and share the joy of Christmas or New Year's Eve.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/3">
              <img
                src="https://images.unsplash.com/photo-1511632765486-a01980968a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="People dining"
                className="rounded-lg object-cover h-64 w-full"
              />
            </div>
            <div className="w-full md:w-2/3">
              <h3 className="text-2xl font-bold mb-4">Why we started</h3>
              <p className="text-gray-600 mb-6">
                "Last year, I realized how many people spend the holidays alone, including war
                refugees and elderly neighbors. We built this platform to turn strangers into
                friends for one magical evening."
              </p>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-green-700">— The Team</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-red-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to share the joy?</h2>
          <div className="flex justify-center">
            <Link
              to={isAuthenticated ? '/register' : '/login'}
              className="bg-white text-red-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
