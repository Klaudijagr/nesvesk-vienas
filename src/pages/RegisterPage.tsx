import { zodResolver } from '@hookform/resolvers/zod';
import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import { ChevronLeft, ChevronRight, Gift, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { api } from '../../convex/_generated/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  AMENITIES_OPTIONS,
  CITIES,
  CONCEPTS,
  DIETARY_OPTIONS,
  HOLIDAY_DATES,
  HOUSE_RULES_OPTIONS,
  LANGUAGES,
  VIBES_OPTIONS,
} from '../lib/types';

// Zod schema for form validation
const profileSchema = z.object({
  role: z.enum(['host', 'guest', 'both']),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  age: z.number().min(18, 'Must be at least 18').max(120).optional(),
  city: z.enum(['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys', 'Other']),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  languages: z
    .array(z.enum(['Lithuanian', 'English', 'Ukrainian', 'Russian']))
    .min(1, 'Select at least one language'),
  availableDates: z
    .array(z.enum(['24 Dec', '25 Dec', '26 Dec', '31 Dec']))
    .min(1, 'Select at least one date'),
  dietaryInfo: z.array(z.string()),
  concept: z.enum(['Party', 'Dinner', 'Hangout']).optional(),
  capacity: z.number().min(1).max(50).optional(),
  amenities: z.array(z.string()),
  houseRules: z.array(z.string()),
  vibes: z.array(z.string()),
  smokingAllowed: z.boolean(),
  drinkingAllowed: z.boolean(),
  petsAllowed: z.boolean(),
  hasPets: z.boolean(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') as 'host' | 'guest') || 'guest';

  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const existingProfile = useQuery(api.profiles.getMyProfile);
  const upsertProfile = useMutation(api.profiles.upsertProfile);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      role: initialRole,
      firstName: '',
      lastName: '',
      city: 'Vilnius',
      bio: '',
      languages: [],
      availableDates: [],
      dietaryInfo: [],
      amenities: [],
      houseRules: [],
      vibes: [],
      smokingAllowed: false,
      drinkingAllowed: true,
      petsAllowed: true,
      hasPets: false,
    },
  });

  const role = watch('role');
  const languages = watch('languages');
  const availableDates = watch('availableDates');
  const dietaryInfo = watch('dietaryInfo');
  const amenities = watch('amenities');
  const houseRules = watch('houseRules');
  const vibes = watch('vibes');

  const isHost = role === 'host' || role === 'both';
  const totalSteps = isHost ? 4 : 3;

  // Redirect if not authenticated
  if (!(authLoading || isAuthenticated)) {
    return <Navigate replace to="/login?redirect=/register" />;
  }

  // Redirect if already has profile
  if (existingProfile) {
    return <Navigate replace to="/dashboard" />;
  }

  const toggleArrayValue = (
    field: 'languages' | 'availableDates' | 'dietaryInfo' | 'amenities' | 'houseRules' | 'vibes',
    value: string,
  ) => {
    const current = watch(field) as string[];
    if (current.includes(value)) {
      setValue(
        field,
        current.filter((v) => v !== value),
      );
    } else {
      setValue(field, [...current, value]);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      await upsertProfile({
        ...data,
        age: data.age || undefined,
        concept: data.concept || undefined,
        capacity: data.capacity || undefined,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create profile:', error);
      alert('Failed to create profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  if (authLoading || existingProfile === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Gift className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="font-bold text-3xl text-gray-900">Create Your Profile</h1>
          <p className="mt-2 text-gray-600">Join the community and find your holiday connection</p>
        </div>

        {/* Progress */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              className={`h-2 w-12 rounded-full transition-colors ${
                i + 1 <= step ? 'bg-red-600' : 'bg-gray-200'
              }`}
              key={`step-${i}`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Tell us a bit about yourself</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Role Selection */}
                <div className="space-y-2">
                  <Label>I want to...</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'host', label: 'Host', desc: 'Invite others' },
                      { value: 'guest', label: 'Be a Guest', desc: 'Find a host' },
                      { value: 'both', label: 'Both', desc: 'Host & visit' },
                    ].map((option) => (
                      <button
                        className={`rounded-lg border-2 p-4 text-center transition-all ${
                          role === option.value
                            ? 'border-red-600 bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        key={option.value}
                        onClick={() => setValue('role', option.value as 'host' | 'guest' | 'both')}
                        type="button"
                      >
                        <div className="font-medium">{option.label}</div>
                        <div className="text-gray-500 text-xs">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      {...register('firstName')}
                      placeholder="Your first name"
                    />
                    {errors.firstName && (
                      <p className="text-red-600 text-sm">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" {...register('lastName')} placeholder="Optional" />
                  </div>
                </div>

                {/* Age & City */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      {...register('age', { valueAsNumber: true })}
                      placeholder="18+"
                    />
                    {errors.age && <p className="text-red-600 text-sm">{errors.age.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <select
                      id="city"
                      {...register('city')}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">About You *</Label>
                  <textarea
                    id="bio"
                    {...register('bio')}
                    className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Tell others about yourself, what you're looking for..."
                    rows={4}
                  />
                  {errors.bio && <p className="text-red-600 text-sm">{errors.bio.message}</p>}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Preferences */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Preferences</CardTitle>
                <CardDescription>Help us match you with the right people</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Languages */}
                <div className="space-y-2">
                  <Label>Languages you speak *</Label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        className={`rounded-full px-4 py-2 text-sm transition-all ${
                          languages.includes(lang)
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        key={lang}
                        onClick={() => toggleArrayValue('languages', lang)}
                        type="button"
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                  {errors.languages && (
                    <p className="text-red-600 text-sm">{errors.languages.message}</p>
                  )}
                </div>

                {/* Available Dates */}
                <div className="space-y-2">
                  <Label>Available dates *</Label>
                  <div className="flex flex-wrap gap-2">
                    {HOLIDAY_DATES.map((date) => (
                      <button
                        className={`rounded-full px-4 py-2 text-sm transition-all ${
                          availableDates.includes(date)
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        key={date}
                        onClick={() => toggleArrayValue('availableDates', date)}
                        type="button"
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                  {errors.availableDates && (
                    <p className="text-red-600 text-sm">{errors.availableDates.message}</p>
                  )}
                </div>

                {/* Dietary */}
                <div className="space-y-2">
                  <Label>Dietary requirements</Label>
                  <div className="flex flex-wrap gap-2">
                    {DIETARY_OPTIONS.map((diet) => (
                      <button
                        className={`rounded-full px-3 py-1.5 text-sm transition-all ${
                          dietaryInfo.includes(diet)
                            ? 'border border-orange-300 bg-orange-100 text-orange-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        key={diet}
                        onClick={() => toggleArrayValue('dietaryInfo', diet)}
                        type="button"
                      >
                        {diet}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Boolean preferences */}
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-gray-50">
                    <input type="checkbox" {...register('smokingAllowed')} className="h-4 w-4" />
                    <span className="text-sm">Smoking OK</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-gray-50">
                    <input type="checkbox" {...register('drinkingAllowed')} className="h-4 w-4" />
                    <span className="text-sm">Alcohol OK</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-gray-50">
                    <input type="checkbox" {...register('petsAllowed')} className="h-4 w-4" />
                    <span className="text-sm">Pets welcome</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-gray-50">
                    <input type="checkbox" {...register('hasPets')} className="h-4 w-4" />
                    <span className="text-sm">I have pets</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Vibes (for all) */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>What's your vibe?</CardTitle>
                <CardDescription>Help others know what to expect</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Vibes */}
                <div className="space-y-2">
                  <Label>Atmosphere you're looking for</Label>
                  <div className="flex flex-wrap gap-2">
                    {VIBES_OPTIONS.map((vibe) => (
                      <button
                        className={`rounded-full px-4 py-2 text-sm transition-all ${
                          vibes.includes(vibe)
                            ? 'border border-purple-300 bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        key={vibe}
                        onClick={() => toggleArrayValue('vibes', vibe)}
                        type="button"
                      >
                        {vibe}
                      </button>
                    ))}
                  </div>
                </div>

                {isHost && (
                  <>
                    {/* Concept */}
                    <div className="space-y-2">
                      <Label>Event type</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {CONCEPTS.map((concept) => (
                          <button
                            className={`rounded-lg border-2 p-3 text-center transition-all ${
                              watch('concept') === concept
                                ? 'border-red-600 bg-red-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            key={concept}
                            onClick={() => setValue('concept', concept)}
                            type="button"
                          >
                            {concept}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Capacity */}
                    <div className="space-y-2">
                      <Label htmlFor="capacity">How many guests can you host?</Label>
                      <Input
                        id="capacity"
                        type="number"
                        {...register('capacity', { valueAsNumber: true })}
                        max={50}
                        min={1}
                        placeholder="e.g., 4"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 4: Host Details (only for hosts) */}
          {step === 4 && isHost && (
            <Card>
              <CardHeader>
                <CardTitle>Host Details</CardTitle>
                <CardDescription>What can guests expect at your place?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Amenities */}
                <div className="space-y-2">
                  <Label>Amenities</Label>
                  <div className="flex flex-wrap gap-2">
                    {AMENITIES_OPTIONS.map((amenity) => (
                      <button
                        className={`rounded-full px-3 py-1.5 text-sm transition-all ${
                          amenities.includes(amenity)
                            ? 'border border-green-300 bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        key={amenity}
                        onClick={() => toggleArrayValue('amenities', amenity)}
                        type="button"
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>

                {/* House Rules */}
                <div className="space-y-2">
                  <Label>House rules</Label>
                  <div className="flex flex-wrap gap-2">
                    {HOUSE_RULES_OPTIONS.map((rule) => (
                      <button
                        className={`rounded-full px-3 py-1.5 text-sm transition-all ${
                          houseRules.includes(rule)
                            ? 'border border-blue-300 bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        key={rule}
                        onClick={() => toggleArrayValue('houseRules', rule)}
                        type="button"
                      >
                        {rule}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="mt-6 flex justify-between">
            <Button
              className="gap-2"
              disabled={step === 1}
              onClick={prevStep}
              type="button"
              variant="outline"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>

            {step < totalSteps ? (
              <Button className="gap-2" onClick={nextStep} type="button">
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button className="gap-2" disabled={isSubmitting} type="submit">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Creating...
                  </>
                ) : (
                  'Create Profile'
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
