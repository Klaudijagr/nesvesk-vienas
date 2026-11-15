import { SignUp } from "@clerk/nextjs";

import { InAppBrowserGate } from "@/components/auth/in-app-browser-gate";

export default function SignUpPage() {
  return (
    <InAppBrowserGate mode="sign-up">
      <div className="bg-muted/50 flex min-h-screen items-center justify-center px-4">
        <SignUp
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
          signInUrl="/sign-in"
        />
      </div>
    </InAppBrowserGate>
  );
}
