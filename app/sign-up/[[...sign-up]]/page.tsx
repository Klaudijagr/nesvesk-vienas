import { SignUp } from "@clerk/nextjs";
import { InAppBrowserGate } from "@/components/auth/in-app-browser-gate";

export default function SignUpPage() {
  return (
    <InAppBrowserGate mode="sign-up">
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl border border-gray-100",
              headerTitle: "text-red-700",
              headerSubtitle: "text-gray-600",
              socialButtonsBlockButton:
                "border-gray-200 hover:bg-gray-50 text-gray-700",
              formButtonPrimary:
                "bg-red-600 hover:bg-red-700 text-white shadow-md",
              footerActionLink: "text-red-700 hover:text-red-800",
            },
          }}
          signInUrl="/sign-in"
        />
      </div>
    </InAppBrowserGate>
  );
}
