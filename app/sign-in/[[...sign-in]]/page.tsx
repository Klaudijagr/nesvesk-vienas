"use client";

import { SignIn } from "@clerk/nextjs";

import { InAppBrowserGate } from "@/components/auth/in-app-browser-gate";

export default function SignInPage() {
  return (
    <InAppBrowserGate mode="sign-in">
      <div className="bg-muted/50 flex min-h-screen items-center justify-center px-4">
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl border border-border/60",
              headerTitle: "text-brand-strong",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton:
                "border-border hover:bg-muted text-foreground/80",
              formButtonPrimary:
                "bg-brand hover:bg-brand-strong text-white shadow-md",
              footerActionLink: "text-brand-strong hover:text-brand-strong",
            },
          }}
          signUpUrl="/sign-up"
        />
      </div>
    </InAppBrowserGate>
  );
}
