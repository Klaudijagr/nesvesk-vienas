import { useConvexAuth } from 'convex/react';
import { ArrowRight, Calendar, Heart, ShieldCheck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useLocale } from '../contexts/locale-context';

export function LandingPage() {
  const { isAuthenticated } = useConvexAuth();
  const { t } = useLocale();

  return (
    <div className="flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-green-800 pt-16 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1482517967863-00e15c9b44be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-center bg-cover opacity-20" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="mb-6 font-extrabold text-4xl tracking-tight md:text-6xl">
              {t.heroTitle}
              <br />
              <span className="text-amber-400">{t.heroHighlight}</span>
            </h1>
            <p className="mb-4 text-amber-200/90 text-lg italic">{t.heroSubtitle}</p>
            <p className="mb-8 text-gray-100 text-lg leading-relaxed md:text-xl">
              {t.heroDescription}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center rounded-full border border-transparent bg-amber-400 px-8 py-4 font-bold text-base text-green-800 shadow-lg transition-transform hover:scale-105 hover:bg-yellow-400 md:text-lg"
                to={isAuthenticated ? '/register?role=host' : '/login?redirect=/register?role=host'}
              >
                {t.startAsHost}
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-full border-2 border-white px-8 py-4 font-bold text-base text-white transition-colors hover:bg-white hover:text-green-800 md:text-lg"
                to="/browse"
              >
                {t.findGathering}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white py-20" id="how-it-works">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-bold text-3xl text-gray-900">{t.howItWorks}</h2>
            <p className="mx-auto max-w-2xl text-gray-500">
              Safe, simple, and meaningful connections for the holiday season.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <Users className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="mb-3 font-bold text-xl">1. {t.step1Title}</h3>
              <p className="text-gray-500">{t.step1Description}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Calendar className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="mb-3 font-bold text-xl">2. {t.step2Title}</h3>
              <p className="text-gray-500">{t.step2Description}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                <Heart className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="mb-3 font-bold text-xl">3. {t.step3Title}</h3>
              <p className="text-gray-500">{t.step3Description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Safety */}
      <div className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 font-bold text-3xl text-gray-900">{t.safetyTitle}</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                    <ShieldCheck className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t.identityVerification}</h4>
                    <p className="text-gray-500 text-sm">{t.identityVerificationDesc}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <Users className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t.mutualMatching}</h4>
                    <p className="text-gray-500 text-sm">{t.mutualMatchingDesc}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
                    <Heart className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t.communityFirst}</h4>
                    <p className="text-gray-500 text-sm">{t.communityFirstDesc}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                alt="People gathering together"
                className="rounded-2xl shadow-lg"
                height={533}
                src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=800&q=80"
                width={800}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-white py-20" id="about">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8 rounded-2xl bg-gradient-to-br from-green-50 to-amber-50 p-8 md:flex-row md:p-12">
            <div className="w-full md:w-1/3">
              <img
                alt="Friends sharing a meal"
                className="h-64 w-full rounded-lg object-cover shadow-md"
                height={533}
                src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                width={800}
              />
            </div>
            <div className="w-full md:w-2/3">
              <h3 className="mb-4 font-bold text-2xl text-gray-900">Why we started</h3>
              <p className="mb-6 text-gray-600">
                "Last year, I realized how many people spend the holidays alone — including war
                refugees, elderly neighbors, and young people far from home. We built this platform
                to turn strangers into friends for one magical evening."
              </p>
              <p className="text-gray-500 text-sm">
                Nešvęsk Vienas connects hosts with empty seats at their table to guests looking for
                somewhere to belong. Because no one should celebrate alone.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-green-800 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <div>
              <div className="font-bold text-3xl text-amber-400">4</div>
              <div className="text-green-200 text-sm">Languages supported</div>
            </div>
            <div>
              <div className="font-bold text-3xl text-amber-400">5</div>
              <div className="text-green-200 text-sm">Cities in Lithuania</div>
            </div>
            <div>
              <div className="font-bold text-3xl text-amber-400">Dec 24-31</div>
              <div className="text-green-200 text-sm">Holiday dates</div>
            </div>
            <div>
              <div className="font-bold text-3xl text-amber-400">18+</div>
              <div className="text-green-200 text-sm">Community members</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 font-bold text-3xl">{t.finalCtaTitle}</h2>
          <p className="mx-auto mb-8 max-w-xl text-red-100">{t.finalCtaDescription}</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              className="flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-red-600 shadow-lg transition-transform hover:scale-105 hover:bg-gray-100"
              to={isAuthenticated ? '/register' : '/login'}
            >
              {t.getStarted} <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              className="flex items-center justify-center gap-2 rounded-full border-2 border-white px-8 py-4 font-bold text-white transition-colors hover:bg-white hover:text-red-600"
              to="/browse"
            >
              {t.browseHosts}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
