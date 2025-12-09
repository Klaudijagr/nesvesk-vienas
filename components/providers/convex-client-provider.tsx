"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const [convex, setConvex] = useState<ConvexReactClient | null>(null);
  const missingConvexEnv = !convexUrl;

  // Fail fast during build/prerender if the Convex URL isn't present so we
  // don't render the app tree without a Convex provider.
  if (missingConvexEnv) {
    throw new Error(
      "NEXT_PUBLIC_CONVEX_URL is not defined in environment variables"
    );
  }

  // We compute the client outside of render effects to keep a stable reference
  // once the env var is present.
  const convexClient = useMemo(
    () => (convexUrl ? new ConvexReactClient(convexUrl) : null),
    [convexUrl]
  );

  useEffect(() => {
    // Avoid instantiating the Convex client during SSR/prerender where
    // process.env may be undefined.
    if (missingConvexEnv || !convexClient) {
      return;
    }

    setConvex(convexClient);
  }, [convexClient, missingConvexEnv]);

  if (!convex) {
    // While the client instantiates on the client, render nothing to avoid
    // rendering children outside a Convex provider.
    return null;
  }

  return (
    <ClerkProvider
      afterSignOutUrl="/"
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInFallbackRedirectUrl="/onboarding"
      signUpFallbackRedirectUrl="/onboarding"
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
