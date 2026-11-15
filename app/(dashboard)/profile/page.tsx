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
      // Redirect to the public profile view - prefer username route if available
      const url =
        myProfile.username === undefined || myProfile.username === ""
          ? `/profile/${myProfile.userId}`
          : `/people/${myProfile.username}`;
      redirect(url);
    }
  }, [myProfile?.userId, myProfile?.username]);

  // Show loading state while fetching profile
  if (myProfile === undefined) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
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
      <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
    </div>
  );
}
