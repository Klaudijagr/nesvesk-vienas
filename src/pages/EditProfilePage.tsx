import { useMutation, useQuery } from 'convex/react';
import { ChevronLeft, Loader2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../convex/_generated/api';
import { PhotoUpload } from '../components/PhotoUpload';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  AMENITIES_OPTIONS,
  CITIES,
  CONCEPT_OPTIONS,
  DIETARY_OPTIONS,
  HOLIDAY_DATES,
  HOUSE_RULES_OPTIONS,
  LANGUAGES,
  VIBES_OPTIONS,
} from '../lib/types';

type ProfileFormData = {
  role: 'host' | 'guest' | 'both';
  firstName: string;
  lastName: string;
  age: number | null;
  city: (typeof CITIES)[number];
  bio: string;
  phone: string;
  address: string;
  languages: (typeof LANGUAGES)[number][];
  availableDates: (typeof HOLIDAY_DATES)[number][];
  dietaryInfo: string[];
  concept: 'Party' | 'Dinner' | 'Hangout' | null;
  capacity: number | null;
  preferredGuestAgeMin: number | null;
  preferredGuestAgeMax: number | null;
  amenities: string[];
  houseRules: string[];
  vibes: string[];
  smokingAllowed: boolean;
  drinkingAllowed: boolean;
  petsAllowed: boolean;
  hasPets: boolean;
};

function ToggleChip({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      className={`rounded-full px-3 py-1.5 font-medium text-sm transition-colors ${
        selected ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      onClick={onToggle}
      type="button"
    >
      {label}
    </button>
  );
}

export function EditProfilePage() {
  const navigate = useNavigate();
  const profile = useQuery(api.profiles.getMyProfile);
  const upsertProfile = useMutation(api.profiles.upsertProfile);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    defaultValues: {
      role: 'guest',
      firstName: '',
      lastName: '',
      age: null,
      city: 'Vilnius',
      bio: '',
      phone: '',
      address: '',
      languages: [],
      availableDates: [],
      dietaryInfo: [],
      concept: null,
      capacity: null,
      preferredGuestAgeMin: null,
      preferredGuestAgeMax: null,
      amenities: [],
      houseRules: [],
      vibes: [],
      smokingAllowed: false,
      drinkingAllowed: true,
      petsAllowed: false,
      hasPets: false,
    },
  });

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      reset({
        role: profile.role,
        firstName: profile.firstName,
        lastName: profile.lastName || '',
        age: profile.age || null,
        city: profile.city,
        bio: profile.bio,
        phone: profile.phone || '',
        address: profile.address || '',
        languages: profile.languages,
        availableDates: profile.availableDates,
        dietaryInfo: profile.dietaryInfo,
        concept: profile.concept || null,
        capacity: profile.capacity || null,
        preferredGuestAgeMin: profile.preferredGuestAgeMin || null,
        preferredGuestAgeMax: profile.preferredGuestAgeMax || null,
        amenities: profile.amenities,
        houseRules: profile.houseRules,
        vibes: profile.vibes,
        smokingAllowed: profile.smokingAllowed,
        drinkingAllowed: profile.drinkingAllowed,
        petsAllowed: profile.petsAllowed,
        hasPets: profile.hasPets,
      });
      setPhotoUrl(profile.photoUrl);
    }
  }, [profile, reset]);

  const role = watch('role');
  const languages = watch('languages');
  const availableDates = watch('availableDates');
  const dietaryInfo = watch('dietaryInfo');
  const amenities = watch('amenities');
  const houseRules = watch('houseRules');
  const vibes = watch('vibes');

  const toggleArrayValue = <T extends string>(
    field: keyof ProfileFormData,
    value: T,
    current: T[],
  ) => {
    if (current.includes(value)) {
      setValue(field, current.filter((v) => v !== value) as ProfileFormData[typeof field]);
    } else {
      setValue(field, [...current, value] as ProfileFormData[typeof field]);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await upsertProfile({
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName || undefined,
        age: data.age || undefined,
        city: data.city,
        bio: data.bio,
        phone: data.phone || undefined,
        address: data.address || undefined,
        languages: data.languages,
        availableDates: data.availableDates,
        dietaryInfo: data.dietaryInfo,
        concept: data.concept || undefined,
        capacity: data.capacity || undefined,
        preferredGuestAgeMin: data.preferredGuestAgeMin || undefined,
        preferredGuestAgeMax: data.preferredGuestAgeMax || undefined,
        amenities: data.amenities,
        houseRules: data.houseRules,
        vibes: data.vibes,
        smokingAllowed: data.smokingAllowed,
        drinkingAllowed: data.drinkingAllowed,
        petsAllowed: data.petsAllowed,
        hasPets: data.hasPets,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (profile === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (profile === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-8 text-center">
            <h2 className="mb-4 font-bold text-xl">No Profile Found</h2>
            <p className="mb-4 text-gray-600">Please create a profile first.</p>
            <Link to="/register">
              <Button>Create Profile</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isHost = role === 'host' || role === 'both';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link to="/dashboard">
            <Button size="sm" variant="ghost">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="font-bold text-2xl text-gray-900">Edit Profile</h1>
            <p className="text-gray-600 text-sm">Update your information</p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Photo */}
              <div>
                <Label>Profile Photo</Label>
                <div className="mt-2">
                  <PhotoUpload currentPhotoUrl={photoUrl} onPhotoUploaded={setPhotoUrl} />
                </div>
              </div>

              {/* Role */}
              <div>
                <Label>I want to be a</Label>
                <div className="mt-2 flex gap-2">
                  {(['guest', 'host', 'both'] as const).map((r) => (
                    <button
                      className={`rounded-lg px-4 py-2 font-medium capitalize ${
                        role === r
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      key={r}
                      onClick={() => setValue('role', r)}
                      type="button"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    {...register('firstName', { required: 'Required' })}
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" {...register('lastName')} />
                  <p className="mt-1 text-gray-500 text-xs">Hidden until match</p>
                </div>
              </div>

              {/* Age */}
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  max={120}
                  min={18}
                  type="number"
                  {...register('age', { valueAsNumber: true })}
                  className="w-24"
                />
              </div>

              {/* City */}
              <div>
                <Label htmlFor="city">City *</Label>
                <select
                  id="city"
                  {...register('city')}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bio */}
              <div>
                <Label htmlFor="bio">Bio *</Label>
                <Textarea
                  id="bio"
                  {...register('bio', { required: 'Required' })}
                  className={errors.bio ? 'border-red-500' : ''}
                  placeholder="Tell others about yourself..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <p className="text-gray-500 text-sm">Hidden until you match with someone</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" {...register('phone')} />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...register('address')} />
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card>
            <CardHeader>
              <CardTitle>Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((lang) => (
                  <ToggleChip
                    key={lang}
                    label={lang}
                    onToggle={() => toggleArrayValue('languages', lang, languages)}
                    selected={languages.includes(lang)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Available Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {HOLIDAY_DATES.map((date) => (
                  <ToggleChip
                    key={date}
                    label={date}
                    onToggle={() => toggleArrayValue('availableDates', date, availableDates)}
                    selected={availableDates.includes(date)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dietary */}
          <Card>
            <CardHeader>
              <CardTitle>Dietary Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {DIETARY_OPTIONS.map((diet) => (
                  <ToggleChip
                    key={diet}
                    label={diet}
                    onToggle={() => toggleArrayValue('dietaryInfo', diet, dietaryInfo)}
                    selected={dietaryInfo.includes(diet)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Host-specific fields */}
          {isHost && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Hosting Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Concept */}
                  <div>
                    <Label>Event Type</Label>
                    <div className="mt-2 flex gap-2">
                      {CONCEPT_OPTIONS.map((c) => (
                        <button
                          className={`rounded-lg px-4 py-2 font-medium ${
                            watch('concept') === c
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          key={c}
                          onClick={() => setValue('concept', c)}
                          type="button"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Capacity */}
                  <div>
                    <Label htmlFor="capacity">Guest Capacity</Label>
                    <Input
                      id="capacity"
                      max={50}
                      min={1}
                      type="number"
                      {...register('capacity', { valueAsNumber: true })}
                      className="w-24"
                    />
                  </div>

                  {/* Guest Age Preference */}
                  <div>
                    <Label>Preferred Guest Age Range</Label>
                    <div className="mt-2 flex items-center gap-2">
                      <Input
                        max={120}
                        min={18}
                        placeholder="Min"
                        type="number"
                        {...register('preferredGuestAgeMin', { valueAsNumber: true })}
                        className="w-20"
                      />
                      <span>to</span>
                      <Input
                        max={120}
                        min={18}
                        placeholder="Max"
                        type="number"
                        {...register('preferredGuestAgeMax', { valueAsNumber: true })}
                        className="w-20"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {AMENITIES_OPTIONS.map((amenity) => (
                      <ToggleChip
                        key={amenity}
                        label={amenity}
                        onToggle={() => toggleArrayValue('amenities', amenity, amenities)}
                        selected={amenities.includes(amenity)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Vibes */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Vibes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {VIBES_OPTIONS.map((vibe) => (
                      <ToggleChip
                        key={vibe}
                        label={vibe}
                        onToggle={() => toggleArrayValue('vibes', vibe, vibes)}
                        selected={vibes.includes(vibe)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* House Rules */}
              <Card>
                <CardHeader>
                  <CardTitle>House Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {HOUSE_RULES_OPTIONS.map((rule) => (
                      <ToggleChip
                        key={rule}
                        label={rule}
                        onToggle={() => toggleArrayValue('houseRules', rule, houseRules)}
                        selected={houseRules.includes(rule)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Toggles */}
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input type="checkbox" {...register('smokingAllowed')} className="h-4 w-4" />
                    <span>Smoking allowed</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3">
                    <input type="checkbox" {...register('drinkingAllowed')} className="h-4 w-4" />
                    <span>Alcohol served</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3">
                    <input type="checkbox" {...register('petsAllowed')} className="h-4 w-4" />
                    <span>Guests can bring pets</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3">
                    <input type="checkbox" {...register('hasPets')} className="h-4 w-4" />
                    <span>I have pets at home</span>
                  </label>
                </CardContent>
              </Card>
            </>
          )}

          {/* Submit */}
          <div className="flex gap-4">
            <Link className="flex-1" to="/dashboard">
              <Button className="w-full" type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button className="flex-1 gap-2" disabled={isSubmitting} type="submit">
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
