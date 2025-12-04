import { useConvexAuth } from 'convex/react';
import { ArrowRight, Calendar, Heart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LandingPage() {
  const { isAuthenticated } = useConvexAuth();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-green-800 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544979590-2c5b3641b633?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-center bg-cover opacity-20" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="mb-6 font-extrabold text-4xl tracking-tight md:text-6xl">
              This Christmas,
              <br />
              <span className="text-amber-400">Nešvęsk Vienas.</span>
            </h1>
            <p className="mb-8 text-gray-100 text-lg leading-relaxed md:text-xl">
              The holidays are meant for connection. Whether you have an empty seat at your table or
              are looking for a place to belong, join Lithuania's community for sharing the festive
              spirit.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center rounded-full border border-transparent bg-amber-400 px-8 py-4 font-bold text-base text-green-800 shadow-lg transition-transform hover:scale-105 hover:bg-yellow-400 md:text-lg"
                to={isAuthenticated ? '/register?role=host' : '/login?redirect=/register?role=host'}
              >
                Become a Host
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-full border-2 border-white px-8 py-4 font-bold text-base text-white transition-colors hover:bg-white hover:text-green-800 md:text-lg"
                to="/browse"
              >
                Find Company
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-bold text-3xl text-gray-900">How It Works</h2>
            <p className="mx-auto max-w-2xl text-gray-500">
              Safe, simple, and meaningful connections.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <Users className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="mb-3 font-bold text-xl">1. Create a Profile</h3>
              <p className="text-gray-500">
                Sign up as a Host or Guest. Share your preferences, languages, and dietary needs.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Calendar className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="mb-3 font-bold text-xl">2. Find a Match</h3>
              <p className="text-gray-500">
                Browse listings by city, age, and language. Send an invitation or request to join.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                <Heart className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="mb-3 font-bold text-xl">3. Celebrate Together</h3>
              <p className="text-gray-500">
                Once matched, connect safely and share the joy of Christmas or New Year's Eve.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-gray-50 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8 rounded-2xl bg-white p-8 shadow-sm md:flex-row md:p-12">
            <div className="w-full md:w-1/3">
              <img
                alt="People dining"
                className="h-64 w-full rounded-lg object-cover"
                src="https://images.unsplash.com/photo-1511632765486-a01980968a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              />
            </div>
            <div className="w-full md:w-2/3">
              <h3 className="mb-4 font-bold text-2xl">Why we started</h3>
              <p className="mb-6 text-gray-600">
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
      <div className="bg-red-600 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-6 font-bold text-3xl">Ready to share the joy?</h2>
          <div className="flex justify-center">
            <Link
              className="flex items-center gap-2 rounded-full bg-white px-8 py-3 font-bold text-red-600 shadow-lg transition-colors hover:bg-gray-100"
              to={isAuthenticated ? '/register' : '/login'}
            >
              Get Started <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
