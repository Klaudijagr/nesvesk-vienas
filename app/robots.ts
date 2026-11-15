import type { MetadataRoute } from "next";

const DEFAULT_SITE_URL = "https://nesveskvienas.lt";
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
// An unset or empty variable falls back to the production URL.
const siteUrl =
  configuredSiteUrl === undefined || configuredSiteUrl === ""
    ? DEFAULT_SITE_URL
    : configuredSiteUrl;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/onboarding",
          "/settings",
          "/messages",
          "/verify",
          // User's own profile page (protected)
          "/profile",
          // Experimental pages
          "/(experiments)/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
