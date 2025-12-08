"use client";

import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";

/**
 * /profile - Redirects to your own public profile view
 * This lets you see what others see when viewing your profile
 */
export default function MyProfilePage() {
  const myProfile = useQuery(api.profiles.getMyProfile);

  useEffect(() => {
    if (myProfile?.userId) {
      // Redirect to the public profile view with your own ID
      redirect(`/profile/${myProfile.userId}`);
    }
  }, [myProfile?.userId]);

  // Show loading state while fetching profile
  if (myProfile === undefined) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // No profile yet - redirect to onboarding
  if (myProfile === null) {
    redirect("/onboarding");
  }

  // This shouldn't render, redirect should happen
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}
