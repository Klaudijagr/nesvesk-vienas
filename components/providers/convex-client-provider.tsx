"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import type { ReactNode } from "react";
import { useMemo, useSyncExternalStore } from "react";

const subscribeToNothing = () => () => {
  // The mounted flag never changes after hydration, so there is nothing to unsubscribe.
};
const getMountedOnClient = () => true;
const getMountedOnServer = () => false;

export const ConvexClientProvider = ({ children }: { children: ReactNode }) => {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const missingConvexEnv = convexUrl === undefined || convexUrl === "";
  const missingClerkEnv =
    clerkPublishableKey === undefined || clerkPublishableKey === "";

  // Fail fast during build/prerender if the Convex URL isn't present so we
  // don't render the app tree without a Convex provider.
  if (missingConvexEnv) {
    throw new Error(
      "NEXT_PUBLIC_CONVEX_URL is not defined in environment variables"
    );
  }

  // Clerk must have a publishable key at runtime; otherwise sign-in will be broken.
  if (missingClerkEnv) {
    throw new Error(
      "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not defined in environment variables"
    );
  }

  // If this is a production deployment but we're still using test keys, sign-in
  // can be rate-limited/blocked and Clerk will warn in the console.
  if (
    process.env.NODE_ENV === "production" &&
    clerkPublishableKey?.startsWith("pk_test_")
  ) {
    console.error(
      "Clerk is configured with a test publishable key in production (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY starts with pk_test_). Use your live key (pk_live_) for production."
    );
  }

  // We compute the client outside of render effects to keep a stable reference
  // once the env var is present.
  const convexClient = useMemo(
    () => (convexUrl ? new ConvexReactClient(convexUrl) : null),
    [convexUrl]
  );

  // False during SSR/prerender and hydration, true once mounted in the browser.
  const isMounted = useSyncExternalStore(
    subscribeToNothing,
    getMountedOnClient,
    getMountedOnServer
  );
  const convex = isMounted ? convexClient : null;

  if (!convex) {
    // Until the app is mounted in the browser, render nothing to avoid
    // rendering children outside a Convex provider.
    return null;
  }

  return (
    <ClerkProvider
      afterSignOutUrl="/"
      publishableKey={clerkPublishableKey}
      signInFallbackRedirectUrl="/onboarding"
      signUpFallbackRedirectUrl="/onboarding"
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
