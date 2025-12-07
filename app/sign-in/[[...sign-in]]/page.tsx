import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-amber-50 px-4">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-xl border border-gray-100",
            headerTitle: "text-green-800",
            headerSubtitle: "text-gray-600",
            socialButtonsBlockButton:
              "border-gray-200 hover:bg-gray-50 text-gray-700",
            formButtonPrimary:
              "bg-green-700 hover:bg-green-800 text-white shadow-md",
            footerActionLink: "text-green-700 hover:text-green-800",
          },
        }}
        signUpUrl="/sign-up"
      />
    </div>
  );
}
