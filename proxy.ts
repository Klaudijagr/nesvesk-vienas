import { offlineResponse } from "@/lib/offline-page";

/**
 * The site is offline: every page, API route and the PostHog proxy answer
 * with the offline notice. Static files under `public/` and `_next` still load.
 * To reopen, revert the commit that introduced this file's current contents.
 */
export const proxy = (): Response => offlineResponse();

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
