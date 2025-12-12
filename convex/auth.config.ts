export default {
  providers: [
    {
      // IMPORTANT:
      // This must match the "issuer" (iss) of the JWTs your frontend receives from Clerk.
      // Hardcoding a dev Clerk instance here will break auth in production.
      domain: (() => {
        const domain = process.env.CLERK_ISSUER_DOMAIN;
        if (!domain) {
          throw new Error(
            "CLERK_ISSUER_DOMAIN is not configured (expected something like https://<instance>.clerk.accounts.dev or your Clerk issuer domain)."
          );
        }
        return domain;
      })(),
      applicationID: "convex",
    },
  ],
};
