"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { VerifyBanner } from "@/components/verify-banner";
import { useLocale } from "@/contexts/locale-context";
import { api } from "@/convex/_generated/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useLocale();
  const router = useRouter();
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth();
  const updateLastActive = useMutation(api.profiles.updateLastActive);
  const hasUpdatedLastActive = useRef(false);

  // Only query profile after auth is ready and user is authenticated
  const profile = useQuery(
    api.profiles.getMyProfile,
    isAuthLoading || !isAuthenticated ? "skip" : undefined
  );

  // Update lastActive timestamp when user visits dashboard
  useEffect(() => {
    if (isAuthenticated && profile && !hasUpdatedLastActive.current) {
      hasUpdatedLastActive.current = true;
      updateLastActive();
    }
  }, [isAuthenticated, profile, updateLastActive]);

  // Redirect to onboarding if no profile or profile incomplete
  useEffect(() => {
    // Wait for auth to settle before making redirect decisions
    if (isAuthLoading) {
      return;
    }

    // If not authenticated, redirect to sign-in
    if (!isAuthenticated) {
      router.push("/sign-in");
      return;
    }

    // profile === undefined means still loading, profile === null means no profile
    if (profile === null) {
      router.push("/onboarding");
    } else if (
      profile &&
      (!(profile.firstName && profile.bio) || profile.languages.length === 0)
    ) {
      router.push("/onboarding");
    }
  }, [isAuthLoading, isAuthenticated, profile, router]);

  // Show loading state while auth is initializing
  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  // Show loading while waiting for auth or profile check
  if (!isAuthenticated || profile === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  // If redirecting to onboarding, show loading
  if (
    profile === null ||
    !profile.firstName ||
    !profile.bio ||
    profile.languages.length === 0
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top navbar - full width */}
      <DashboardNavbar />
      <VerifyBanner />

      {/* Main content area - scrollable, centered */}
      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-6">{children}</div>
      </main>

      {/* Footer */}
      <footer className="shrink-0 border-t bg-gray-50 py-4">
        <div className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} {t.appName}. {t.allRightsReserved}
        </div>
      </footer>
    </div>
  );
}
