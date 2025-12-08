"use client";

import { redirect } from "next/navigation";

/**
 * Old onboarding path - redirect to new fullscreen onboarding
 */
export default function OldOnboardingPage() {
  redirect("/onboarding");
}
