'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/contexts/locale-context';
import { findUserByEmail, setCurrentUser } from '@/lib/auth-storage';
import { useTranslation } from '@/lib/i18n';

export default function SignInPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const t = useTranslation(locale);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const user = findUserByEmail(formData.email);
    if (!user) {
      setError('Invalid email or password');
      setLoading(false);
      return;
    }

    // In a real app, verify password hash
    // For demo purposes, we'll just check if account exists
    setCurrentUser(user);

    setTimeout(() => {
      if (!user.emailVerified) {
        router.push('/auth/verify-email');
      } else if (!user.role || user.role === 'guest') {
        router.push('/auth/choose-role');
      } else {
        router.push('/dashboard');
      }
    }, 500);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">{t.signIn}</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
                <Input
                  id="email"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  type="email"
                  value={formData.email}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <Input
                  id="password"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  type="password"
                  value={formData.password}
                />
              </div>

              {error && <p className="text-destructive text-sm">{error}</p>}

              <Button className="w-full" disabled={loading} type="submit">
                {loading ? 'Signing in...' : t.signIn}
              </Button>

              <p className="text-center text-muted-foreground text-sm">
                Don't have an account?{' '}
                <Link className="font-medium text-primary hover:underline" href="/auth/signup">
                  {t.signUp}
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
