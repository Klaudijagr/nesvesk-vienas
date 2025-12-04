import { useAuthActions } from '@convex-dev/auth/react';
import { useConvexAuth, useQuery } from 'convex/react';
import { Gift, Home, Inbox, LogIn, LogOut, Menu, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../../convex/_generated/api';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const profile = useQuery(api.profiles.getMyProfile);
  const { signOut } = useAuthActions();

  const isActive = (path: string) =>
    location.pathname === path
      ? 'text-red-600 font-semibold bg-red-50'
      : 'text-gray-600 hover:text-red-600 hover:bg-gray-50';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                <div className="bg-red-100 p-1.5 rounded-lg group-hover:bg-red-200 transition-colors">
                  <Gift className="h-6 w-6 text-red-600" />
                </div>
                <span className="font-bold text-xl text-gray-900 tracking-tight">
                  Nešvęsk Vienas
                </span>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-1">
                <Link
                  to="/"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${isActive('/')}`}
                >
                  <Home className="w-4 h-4" /> Home
                </Link>
                <Link
                  to="/browse"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${isActive('/browse')}`}
                >
                  <Search className="w-4 h-4" /> Find a Host
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/dashboard"
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${isActive('/dashboard')}`}
                  >
                    <Inbox className="w-4 h-4" /> Inbox
                  </Link>
                )}
              </div>
            </div>

            {/* Right Side */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center gap-1 text-xs text-gray-500 border-r pr-6">
                <span className="cursor-pointer hover:text-black font-bold px-1">EN</span>
                <span className="cursor-pointer hover:text-black px-1">LT</span>
                <span className="cursor-pointer hover:text-black px-1">UA</span>
                <span className="cursor-pointer hover:text-black px-1">RU</span>
              </div>

              {isLoading ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              ) : isAuthenticated && profile ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/profile/me"
                    className="flex items-center gap-3 hover:bg-gray-50 p-1 pr-3 rounded-full border border-transparent hover:border-gray-200 transition-all"
                  >
                    <img
                      src={
                        profile.photoUrl ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${profile.firstName}`
                      }
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-gray-700">{profile.firstName}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-full transition-all shadow-sm hover:shadow-md"
                >
                  <LogIn className="w-4 h-4" />
                  Login / Join
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
            <div className="pt-2 pb-3 space-y-1 px-4">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 px-3 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
              >
                Home
              </Link>
              <Link
                to="/browse"
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 px-3 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
              >
                Find a Host
              </Link>
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-3 px-3 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
                >
                  Inbox
                </Link>
              )}
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-3 px-3 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-3 px-3 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
                >
                  Login / Join
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="col-span-1 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Gift className="h-6 w-6 text-red-500" />
                <span className="font-bold text-lg">Nešvęsk Vienas</span>
              </div>
              <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                A non-profit initiative connecting people for the holidays. Whether you're a host
                with an extra chair or a guest looking for company, you belong here.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Platform</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link to="/browse" className="hover:text-amber-400 transition-colors">
                    Find a Host
                  </Link>
                </li>
                <li>
                  <Link to="/register?role=host" className="hover:text-amber-400 transition-colors">
                    Become a Host
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register?role=guest"
                    className="hover:text-amber-400 transition-colors"
                  >
                    Guest Sign Up
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Legal & Safety</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link to="/terms" className="hover:text-amber-400 transition-colors">
                    Safety Guidelines
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-amber-400 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-amber-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center">
            <span>© {new Date().getFullYear()} Nešvęsk Vienas. All rights reserved.</span>
            <span className="mt-2 md:mt-0">Made with love for Lithuania</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
