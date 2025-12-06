'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type React from 'react';
import { Suspense, useState } from 'react';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/contexts/locale-context';
import { findUserByEmail, saveUser, setCurrentUser } from '@/lib/auth-storage';
import { useTranslation } from '@/lib/i18n';
import type { User } from '@/lib/types';

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const t = useTranslation(locale);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    age: '',
    phone: '',
    confirmAge: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (
      !(
        formData.email &&
        formData.password &&
        formData.firstName &&
        formData.lastName &&
        formData.age
      )
    ) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (Number.parseInt(formData.age) < 18) {
      setError('You must be 18 or older to register');
      setLoading(false);
      return;
    }

    if (!formData.confirmAge) {
      setError('You must confirm that you are 18 or older');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Check if email already exists
    const existingUser = findUserByEmail(formData.email);
    if (existingUser) {
      setError('An account with this email already exists');
      setLoading(false);
      return;
    }

    // Create user
    const newUser: User = {
      id: crypto.randomUUID(),
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      age: Number.parseInt(formData.age),
      phone: formData.phone || undefined,
      role: 'guest', // Will be set after role selection
      emailVerified: false,
      phoneVerified: false,
      completedMeetupsCount: 0,
      createdAt: new Date(),
    };

    saveUser(newUser);
    setCurrentUser(newUser);

    // Redirect to email verification
    setTimeout(() => {
      router.push('/auth/verify-email');
    }, 500);
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">{t.signUp}</CardTitle>
        <CardDescription>Create your account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t.firstName} *</Label>
              <Input
                id="firstName"
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                value={formData.firstName}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t.lastName} *</Label>
              <Input
                id="lastName"
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                value={formData.lastName}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t.email} *</Label>
            <Input
              id="email"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              type="email"
              value={formData.email}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">{t.age} *</Label>
            <Input
              id="age"
              min="18"
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              required
              type="number"
              value={formData.age}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t.phone} (optional)</Label>
            <Input
              id="phone"
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              type="tel"
              value={formData.phone}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t.password} *</Label>
            <Input
              id="password"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              type="password"
              value={formData.password}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t.confirmPassword} *</Label>
            <Input
              id="confirmPassword"
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              type="password"
              value={formData.confirmPassword}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.confirmAge}
              id="confirmAge"
              onCheckedChange={(checked) =>
                setFormData({ ...formData, confirmAge: checked as boolean })
              }
            />
            <Label className="font-normal text-sm" htmlFor="confirmAge">
              {t.confirmAge}
            </Label>
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button className="w-full" disabled={loading} type="submit">
            {loading ? 'Creating account...' : t.signUp}
          </Button>

          <p className="text-center text-muted-foreground text-sm">
            Already have an account?{' '}
            <Link className="font-medium text-primary hover:underline" href="/auth/signin">
              {t.signIn}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center p-4">
        <Suspense fallback={<div>Loading...</div>}>
          <SignUpForm />
        </Suspense>
      </main>
    </div>
  );
}
