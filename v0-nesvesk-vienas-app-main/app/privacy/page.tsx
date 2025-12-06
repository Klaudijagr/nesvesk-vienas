'use client';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <h1 className="mb-8 font-bold text-4xl text-foreground">Privacy Policy</h1>
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p>Last updated: December 2025</p>
            <h2 className="mt-6 font-semibold text-foreground text-xl">Information We Collect</h2>
            <p>
              We collect information you provide when creating an account, including name, email,
              age, and profile details.
            </p>
            <h2 className="mt-6 font-semibold text-foreground text-xl">
              How We Use Your Information
            </h2>
            <p>
              Your information is used to facilitate connections between hosts and guests, and to
              improve our services.
            </p>
            <h2 className="mt-6 font-semibold text-foreground text-xl">Data Protection</h2>
            <p>
              We never share exact addresses publicly. Contact information is only exchanged after
              mutual acceptance.
            </p>
            <h2 className="mt-6 font-semibold text-foreground text-xl">Your Rights</h2>
            <p>
              You have the right to access, modify, or delete your personal information at any time.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
