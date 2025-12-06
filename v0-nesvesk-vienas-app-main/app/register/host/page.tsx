'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect, useState } from 'react';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLocale } from '@/contexts/locale-context';
import { getCurrentUser } from '@/lib/auth-storage';
import {
  ALCOHOL_OPTIONS,
  ATMOSPHERE_OPTIONS,
  AVAILABLE_LANGUAGES,
  CELEBRATION_DATES,
  DIETARY_OPTIONS,
  getDistrictsForCity,
  LITHUANIAN_CITIES,
  MAJOR_CITIES_WITH_DISTRICTS,
} from '@/lib/constants';
import { useTranslation } from '@/lib/i18n';
import type { HostProfile } from '@/lib/types';

export default function HostRegistrationPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const t = useTranslation(locale);
  const [user, setUser] = useState(getCurrentUser());

  const [formData, setFormData] = useState<Partial<HostProfile> & { districtOther?: string }>({
    city: '',
    district: '',
    districtOther: '',
    languages: [],
    capacity: 2,
    availableDates: [],
    dietary: [],
    alcoholPolicy: 'light',
    atmosphere: 'games',
    hasPets: false,
    hasKids: false,
    description: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'host') {
      router.push('/auth/signin');
    }
  }, [user, router]);

  const showDistrictDropdown = MAJOR_CITIES_WITH_DISTRICTS.includes(formData.city as any);
  const districts = formData.city ? getDistrictsForCity(formData.city) : [];

  const handleLanguageToggle = (langValue: string) => {
    const current = formData.languages || [];
    if (current.includes(langValue)) {
      setFormData({ ...formData, languages: current.filter((l) => l !== langValue) });
    } else {
      setFormData({ ...formData, languages: [...current, langValue] });
    }
  };

  const handleDateToggle = (dateValue: string) => {
    const current = formData.availableDates || [];
    if (current.includes(dateValue)) {
      setFormData({ ...formData, availableDates: current.filter((d) => d !== dateValue) });
    } else {
      setFormData({ ...formData, availableDates: [...current, dateValue] });
    }
  };

  const handleDietaryToggle = (dietValue: string) => {
    const current = formData.dietary || [];
    if (current.includes(dietValue)) {
      setFormData({ ...formData, dietary: current.filter((d) => d !== dietValue) });
    } else {
      setFormData({ ...formData, dietary: [...current, dietValue] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!(formData.city && formData.languages?.length && formData.availableDates?.length)) {
      setError('Please fill in all required fields');
      return;
    }

    const finalDistrict =
      formData.district === 'Other (specify)' ? formData.districtOther : formData.district;

    const profile: HostProfile = {
      userId: user!.id,
      city: formData.city,
      district: finalDistrict,
      languages: formData.languages,
      capacity: formData.capacity || 2,
      availableDates: formData.availableDates,
      dietary: formData.dietary || [],
      alcoholPolicy: formData.alcoholPolicy || 'light',
      atmosphere: formData.atmosphere || 'games',
      hasPets: formData.hasPets,
      hasKids: formData.hasKids,
      description: formData.description || '',
    };

    // Save profile to localStorage
    const profiles = JSON.parse(localStorage.getItem('hostProfiles') || '[]');
    const existingIndex = profiles.findIndex((p: HostProfile) => p.userId === user!.id);
    if (existingIndex >= 0) {
      profiles[existingIndex] = profile;
    } else {
      profiles.push(profile);
    }
    localStorage.setItem('hostProfiles', JSON.stringify(profiles));

    router.push('/dashboard');
  };

  if (!user || user.role !== 'host') return null;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-3xl px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Host Registration</CardTitle>
              <CardDescription>Tell us about your celebration and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* City Selection */}
                <div className="space-y-2">
                  <Label htmlFor="city">{t.city} *</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData({ ...formData, city: value, district: '' })
                    }
                    value={formData.city}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {LITHUANIAN_CITIES.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* District Selection */}
                {showDistrictDropdown && (
                  <div className="space-y-2">
                    <Label htmlFor="district">{t.district}</Label>
                    <Select
                      onValueChange={(value) => setFormData({ ...formData, district: value })}
                      value={formData.district}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Other District Input */}
                {formData.district === 'Other (specify)' && (
                  <div className="space-y-2">
                    <Label htmlFor="districtOther">Specify District</Label>
                    <Input
                      id="districtOther"
                      onChange={(e) => setFormData({ ...formData, districtOther: e.target.value })}
                      value={formData.districtOther}
                    />
                  </div>
                )}

                {/* Languages */}
                <div className="space-y-2">
                  <Label>{t.languages} *</Label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {AVAILABLE_LANGUAGES.map((lang) => (
                      <div className="flex items-center space-x-2" key={lang.value}>
                        <Checkbox
                          checked={formData.languages?.includes(lang.value)}
                          id={`lang-${lang.value}`}
                          onCheckedChange={() => handleLanguageToggle(lang.value)}
                        />
                        <Label className="font-normal" htmlFor={`lang-${lang.value}`}>
                          {lang.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Capacity */}
                <div className="space-y-2">
                  <Label htmlFor="capacity">{t.capacity} *</Label>
                  <Input
                    id="capacity"
                    max="20"
                    min="1"
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: Number.parseInt(e.target.value) })
                    }
                    required
                    type="number"
                    value={formData.capacity}
                  />
                </div>

                {/* Available Dates */}
                <div className="space-y-2">
                  <Label>{t.dates} *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {CELEBRATION_DATES.map((date) => (
                      <div className="flex items-center space-x-2" key={date.value}>
                        <Checkbox
                          checked={formData.availableDates?.includes(date.value)}
                          id={`date-${date.value}`}
                          onCheckedChange={() => handleDateToggle(date.value)}
                        />
                        <Label className="font-normal" htmlFor={`date-${date.value}`}>
                          {t[date.key]}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dietary Options */}
                <div className="space-y-2">
                  <Label>{t.dietary}</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {DIETARY_OPTIONS.map((diet) => (
                      <div className="flex items-center space-x-2" key={diet.value}>
                        <Checkbox
                          checked={formData.dietary?.includes(diet.value)}
                          id={`diet-${diet.value}`}
                          onCheckedChange={() => handleDietaryToggle(diet.value)}
                        />
                        <Label className="font-normal" htmlFor={`diet-${diet.value}`}>
                          {t[diet.key]}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alcohol Policy */}
                <div className="space-y-2">
                  <Label>{t.alcohol} *</Label>
                  <RadioGroup
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, alcoholPolicy: value })
                    }
                    value={formData.alcoholPolicy}
                  >
                    {ALCOHOL_OPTIONS.map((option) => (
                      <div className="flex items-center space-x-2" key={option.value}>
                        <RadioGroupItem id={`alcohol-${option.value}`} value={option.value} />
                        <Label className="font-normal" htmlFor={`alcohol-${option.value}`}>
                          {t[option.key]}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Atmosphere */}
                <div className="space-y-2">
                  <Label>{t.atmosphere} *</Label>
                  <RadioGroup
                    onValueChange={(value: any) => setFormData({ ...formData, atmosphere: value })}
                    value={formData.atmosphere}
                  >
                    {ATMOSPHERE_OPTIONS.map((option) => (
                      <div className="flex items-center space-x-2" key={option.value}>
                        <RadioGroupItem id={`atmos-${option.value}`} value={option.value} />
                        <Label className="font-normal" htmlFor={`atmos-${option.value}`}>
                          {t[option.key]}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Pets and Kids */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.hasPets}
                      id="hasPets"
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, hasPets: checked as boolean })
                      }
                    />
                    <Label className="font-normal" htmlFor="hasPets">
                      {t.pets}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.hasKids}
                      id="hasKids"
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, hasKids: checked as boolean })
                      }
                    />
                    <Label className="font-normal" htmlFor="hasKids">
                      {t.kids}
                    </Label>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">{t.description} *</Label>
                  <Textarea
                    id="description"
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tell guests about your celebration, what to expect, any special traditions..."
                    required
                    rows={5}
                    value={formData.description}
                  />
                </div>

                {error && <p className="text-destructive text-sm">{error}</p>}

                <Button className="w-full" size="lg" type="submit">
                  {t.save} & Continue to Dashboard
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
