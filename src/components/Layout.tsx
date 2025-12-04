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
    <div className="flex min-h-screen flex-col bg-gray-50 font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-gray-100 border-b bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center gap-8">
              <Link className="group flex flex-shrink-0 items-center gap-2" to="/">
                <div className="rounded-lg bg-red-100 p-1.5 transition-colors group-hover:bg-red-200">
                  <Gift className="h-6 w-6 text-red-600" />
                </div>
                <span className="font-bold text-gray-900 text-xl tracking-tight">
                  Nešvęsk Vienas
                </span>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden items-center gap-1 md:flex">
                <Link
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${isActive('/')}`}
                  to="/"
                >
                  <Home className="h-4 w-4" /> Home
                </Link>
                <Link
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${isActive('/browse')}`}
                  to="/browse"
                >
                  <Search className="h-4 w-4" /> Find a Host
                </Link>
                {isAuthenticated && (
                  <Link
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${isActive('/dashboard')}`}
                    to="/dashboard"
                  >
                    <Inbox className="h-4 w-4" /> Inbox
                  </Link>
                )}
              </div>
            </div>

            {/* Right Side */}
            <div className="hidden items-center space-x-6 md:flex">
              <div className="flex items-center gap-1 border-r pr-6 text-gray-500 text-xs">
                <span className="cursor-pointer px-1 font-bold hover:text-black">EN</span>
                <span className="cursor-pointer px-1 hover:text-black">LT</span>
                <span className="cursor-pointer px-1 hover:text-black">UA</span>
                <span className="cursor-pointer px-1 hover:text-black">RU</span>
              </div>

              {isLoading ? (
                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
              ) : isAuthenticated && profile ? (
                <div className="flex items-center gap-3">
                  <Link
                    className="flex items-center gap-3 rounded-full border border-transparent p-1 pr-3 transition-all hover:border-gray-200 hover:bg-gray-50"
                    to="/profile/me"
                  >
                    <img
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"
                      src={
                        profile.photoUrl ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${profile.firstName}`
                      }
                    />
                    <span className="font-medium text-gray-700 text-sm">{profile.firstName}</span>
                  </Link>
                  <button
                    className="p-2 text-gray-400 transition-colors hover:text-gray-600"
                    onClick={() => signOut()}
                    title="Sign out"
                    type="button"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <Link
                  className="flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 font-bold text-sm text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-md"
                  to="/login"
                >
                  <LogIn className="h-4 w-4" />
                  Login / Join
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                type="button"
              >
                {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute w-full border-gray-100 border-t bg-white shadow-lg md:hidden">
            <div className="space-y-1 px-4 pt-2 pb-3">
              <Link
                className="block rounded-md px-3 py-3 font-medium text-base text-gray-700 hover:bg-gray-50 hover:text-red-600"
                onClick={() => setIsMenuOpen(false)}
                to="/"
              >
                Home
              </Link>
              <Link
                className="block rounded-md px-3 py-3 font-medium text-base text-gray-700 hover:bg-gray-50 hover:text-red-600"
                onClick={() => setIsMenuOpen(false)}
                to="/browse"
              >
                Find a Host
              </Link>
              {isAuthenticated && (
                <Link
                  className="block rounded-md px-3 py-3 font-medium text-base text-gray-700 hover:bg-gray-50 hover:text-red-600"
                  onClick={() => setIsMenuOpen(false)}
                  to="/dashboard"
                >
                  Inbox
                </Link>
              )}
              {isAuthenticated ? (
                <button
                  className="block w-full rounded-md px-3 py-3 text-left font-medium text-base text-gray-700 hover:bg-gray-50 hover:text-red-600"
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  type="button"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  className="block rounded-md px-3 py-3 font-medium text-base text-gray-700 hover:bg-gray-50 hover:text-red-600"
                  onClick={() => setIsMenuOpen(false)}
                  to="/login"
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
      <footer className="border-gray-800 border-t bg-slate-900 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="col-span-1 lg:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <Gift className="h-6 w-6 text-red-500" />
                <span className="font-bold text-lg">Nešvęsk Vienas</span>
              </div>
              <p className="max-w-sm text-gray-400 text-sm leading-relaxed">
                A non-profit initiative connecting people for the holidays. Whether you're a host
                with an extra chair or a guest looking for company, you belong here.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-white">Platform</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link className="transition-colors hover:text-amber-400" to="/browse">
                    Find a Host
                  </Link>
                </li>
                <li>
                  <Link className="transition-colors hover:text-amber-400" to="/register?role=host">
                    Become a Host
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition-colors hover:text-amber-400"
                    to="/register?role=guest"
                  >
                    Guest Sign Up
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-white">Legal & Safety</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link className="transition-colors hover:text-amber-400" to="/terms">
                    Safety Guidelines
                  </Link>
                </li>
                <li>
                  <Link className="transition-colors hover:text-amber-400" to="/terms">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link className="transition-colors hover:text-amber-400" to="/terms">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between border-gray-800 border-t pt-8 text-center text-gray-500 text-sm md:flex-row">
            <span>© {new Date().getFullYear()} Nešvęsk Vienas. All rights reserved.</span>
            <span className="mt-2 md:mt-0">Made with love for Lithuania</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
