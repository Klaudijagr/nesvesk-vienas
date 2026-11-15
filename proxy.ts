import { clerkMiddleware } from "@clerk/nextjs/server";

/** Pages and files anyone may load without signing in. */
const PUBLIC_PATHS = new Set([
  "/",
  "/safety",
  "/terms",
  "/privacy",
  "/cookies",
  "/robots.txt",
  "/sitemap.xml",
]);

/**
 * Path prefixes that stay public: Clerk's own sign-in and sign-up flows,
 * signed webhooks, and the PostHog proxy that signed-out visitors also use.
 */
const PUBLIC_PREFIXES = ["/sign-in", "/sign-up", "/api/webhooks", "/ingest"];

const isPublicPath = (pathname: string): boolean =>
  PUBLIC_PATHS.has(pathname) ||
  PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));

export const proxy = clerkMiddleware(async (auth, request) => {
  if (!isPublicPath(request.nextUrl.pathname)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
