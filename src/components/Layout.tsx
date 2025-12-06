import { SignedIn } from '@clerk/clerk-react';
import { Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { TopBar } from './TopBar';

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar - only show when signed in */}
      <SignedIn>
        <AppSidebar />
      </SignedIn>

      {/* Main content area */}
      <div className="flex min-h-screen flex-1 flex-col">
        {/* Top bar - only show when signed in */}
        <SignedIn>
          <TopBar />
        </SignedIn>

        {/* Main content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t bg-slate-900 py-12 text-white">
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
                    <Link
                      className="transition-colors hover:text-amber-400"
                      to="/register?role=host"
                    >
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
            <div className="mt-12 border-gray-800 border-t pt-8 text-center text-gray-500 text-sm">
              <span>© {new Date().getFullYear()} Nešvęsk Vienas. All rights reserved.</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
