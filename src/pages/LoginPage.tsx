import { SignIn } from '@clerk/clerk-react';

export function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4">
      <SignIn
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'shadow-lg',
          },
        }}
        routing="hash"
        signUpUrl="/signup"
      />
    </div>
  );
}
