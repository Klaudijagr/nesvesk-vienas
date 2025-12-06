'use client';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <h1 className="mb-8 font-bold text-4xl text-foreground">Terms of Service</h1>
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p>Last updated: December 2025</p>
            <h2 className="mt-6 font-semibold text-foreground text-xl">Agreement to Terms</h2>
            <p>
              By accessing and using this platform, you agree to be bound by these Terms of Service.
            </p>
            <h2 className="mt-6 font-semibold text-foreground text-xl">User Responsibilities</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account and for all
              activities under your account.
            </p>
            <h2 className="mt-6 font-semibold text-foreground text-xl">Prohibited Conduct</h2>
            <p>
              Users must not engage in any unlawful, harmful, or fraudulent activities on the
              platform.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
