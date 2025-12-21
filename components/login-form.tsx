"use client";

import { useSignIn, useSignUp } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Mode = "sign-in" | "sign-up";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { signIn, isLoaded: signInLoaded, setActive } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();

  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isLoaded = signInLoaded && signUpLoaded;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      if (mode === "sign-in") {
        const result = await signIn.create({
          identifier: email,
          password,
        });

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          router.push("/browse");
        }
      } else {
        const result = await signUp.create({
          emailAddress: email,
          password,
          firstName,
        });

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          router.push("/onboarding");
        }
      }
    } catch (err) {
      const clerkError = err as { errors?: Array<{ message: string }> };
      const message =
        clerkError.errors?.[0]?.message ??
        (err instanceof Error ? err.message : "Something went wrong");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full max-w-md border-gray-100 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-green-800">
            {mode === "sign-in" ? "Sign in" : "Create account"}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {mode === "sign-in"
              ? "Enter your email and password to continue"
              : "Enter your details to create an account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              {mode === "sign-up" && (
                <Field>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <Input
                    id="firstName"
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Your name"
                    required
                    type="text"
                    value={firstName}
                  />
                </Field>
              )}

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={email}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  type="password"
                  value={password}
                />
              </Field>

              {error && <FieldError>{error}</FieldError>}

              <Field>
                <Button
                  className="w-full bg-green-700 text-white shadow-md hover:bg-green-800"
                  disabled={isLoading || !isLoaded}
                  type="submit"
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {mode === "sign-in" ? "Sign In" : "Create Account"}
                </Button>

                <FieldDescription className="text-center">
                  {mode === "sign-in" ? (
                    <>
                      Don&apos;t have an account?{" "}
                      <button
                        className="text-green-700 underline-offset-4 hover:text-green-800 hover:underline"
                        onClick={() => setMode("sign-up")}
                        type="button"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        className="text-green-700 underline-offset-4 hover:text-green-800 hover:underline"
                        onClick={() => setMode("sign-in")}
                        type="button"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
