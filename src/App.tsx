import { useConvexAuth } from 'convex/react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { BrowsePage } from './pages/BrowsePage';
import { DashboardPage } from './pages/DashboardPage';
import { EditProfilePage } from './pages/EditProfilePage';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { MatchesPage } from './pages/MatchesPage';
import { ProfilePage } from './pages/ProfilePage';
import { RegisterPage } from './pages/RegisterPage';

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();

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

  return <>{children}</>;
}

export function App() {
  return (
    <Layout>
      <Routes>
        <Route element={<LandingPage />} path="/" />
        <Route element={<BrowsePage />} path="/browse" />
        <Route element={<LoginPage />} path="/login" />
        <Route
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
          path="/dashboard"
        />
        {/* Register - protected */}
        <Route
          element={
            <ProtectedRoute>
              <RegisterPage />
            </ProtectedRoute>
          }
          path="/register"
        />
        {/* Matches - protected */}
        <Route
          element={
            <ProtectedRoute>
              <MatchesPage />
            </ProtectedRoute>
          }
          path="/matches"
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

export default App;
