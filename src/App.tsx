import { useConvexAuth, useQuery } from 'convex/react';
import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { api } from '../convex/_generated/api';
import { Layout } from './components/Layout';
import { BrowsePage } from './pages/BrowsePage';
import { EditProfilePage } from './pages/EditProfilePage';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { MessagesPage } from './pages/MessagesPage';
import { ProfilePage } from './pages/ProfilePage';
import { RegisterPage } from './pages/RegisterPage';
import { SettingsPage } from './pages/SettingsPage';
import { VerifyPage } from './pages/VerifyPage';

// Protected route wrapper - checks auth AND profile existence
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const location = useLocation();
  const profile = useQuery(api.profiles.getMyProfile);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-red-600 border-b-2" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  // Wait for profile query to load
  if (profile === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-red-600 border-b-2" />
      </div>
    );
  }

  // If no profile and not already on register page, redirect to onboarding
  if (profile === null && location.pathname !== '/register') {
    return <Navigate replace to="/register" />;
  }

  return <>{children}</>;
}

// Home route - redirects authenticated users to browse
function HomeRoute() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-red-600 border-b-2" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate replace to="/browse" />;
  }

  return <LandingPage />;
}

// Lazy load preview component to avoid circular import issues
const OnboardingPreview = () =>
  import('./pages/OnboardingPreview').then((m) => m.OnboardingPreview);

export function App() {
  const location = useLocation();

  // Full-screen routes that don't use the Layout
  if (location.pathname === '/preview') {
    return (
      <Routes>
        <Route element={<OnboardingPreviewPage />} path="/preview" />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route element={<HomeRoute />} path="/" />
        <Route
          element={
            <ProtectedRoute>
              <BrowsePage />
            </ProtectedRoute>
          }
          path="/browse"
        />
        <Route element={<LoginPage />} path="/login" />
        {/* Register/Onboarding - protected but allows no profile */}
        <Route
          element={
            <ProtectedRoute>
              <RegisterPage />
            </ProtectedRoute>
          }
          path="/register"
        />
        {/* Messages - protected */}
        <Route
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
          path="/messages"
        />
        {/* Settings - protected */}
        <Route
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
          path="/settings"
        />
        {/* Edit profile - protected */}
        <Route
          element={
            <ProtectedRoute>
              <EditProfilePage />
            </ProtectedRoute>
          }
          path="/profile/edit"
        />
        {/* Verify identity - protected */}
        <Route
          element={
            <ProtectedRoute>
              <VerifyPage />
            </ProtectedRoute>
          }
          path="/verify"
        />
        {/* Profile view */}
        <Route element={<ProfilePage />} path="/profile/:id" />
        {/* Static pages */}
        <Route
          element={
            <div className="mx-auto max-w-3xl p-8">
              <h1 className="mb-4 font-bold text-2xl">Terms of Service</h1>
              <p className="text-gray-600">Coming soon...</p>
            </div>
          }
          path="/terms"
        />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </Layout>
  );
}

// Separate component to handle the preview import
function OnboardingPreviewPage() {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    import('./pages/OnboardingPreview').then((m) => {
      setComponent(() => m.OnboardingPreview);
    });
  }, []);

  if (!Component) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-900">
        <div className="h-8 w-8 animate-spin rounded-full border-amber-400 border-b-2" />
      </div>
    );
  }

  return <Component />;
}

export default App;
