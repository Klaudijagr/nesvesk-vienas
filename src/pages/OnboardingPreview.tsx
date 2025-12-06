import { ChevronLeft, ChevronRight, Gift, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  CITIES,
  CONCEPTS,
  DIETARY_OPTIONS,
  HOLIDAY_DATES,
  LANGUAGES,
  VIBES_OPTIONS,
} from '../lib/types';

const TOTAL_STEPS = 4;

export function OnboardingPreview() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'host' | 'guest' | null>(null);
  const [firstName, setFirstName] = useState('');
  const [city, setCity] = useState('Vilnius');
  const [bio, setBio] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [dietary, setDietary] = useState<string[]>([]);
  const [vibes, setVibes] = useState<string[]>([]);
  const [concept, setConcept] = useState<string | null>(null);

  const progress = (step / TOTAL_STEPS) * 100;

  const toggleItem = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    item: string,
  ) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return role !== null;
      case 2:
        return firstName.length > 0 && bio.length >= 10;
      case 3:
        return languages.length > 0 && availableDates.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSkip = () => {
    // In real implementation, would create minimal profile and redirect
    navigate('/browse');
  };

  const handleComplete = () => {
    // In real implementation, would save profile and redirect
    alert('Profile would be created! Check console for data.');
    console.log({
      role,
      firstName,
      city,
      bio,
      languages,
      availableDates,
      dietary,
      vibes,
      concept,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-green-900 via-green-800 to-green-900">
      {/* Top bar with progress */}
      <div className="flex items-center justify-between px-6 py-4">
        <button
          className="flex items-center gap-2 text-white/70 transition-colors hover:text-white"
          onClick={() => navigate(-1)}
          type="button"
        >
          <X className="h-5 w-5" />
          <span className="text-sm">Exit</span>
        </button>

        {/* Progress bar */}
        <div className="mx-8 h-1 flex-1 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-amber-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          className="text-sm text-white/70 transition-colors hover:text-white"
          onClick={handleSkip}
          type="button"
        >
          Skip for now
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="w-full max-w-lg">
          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="fade-in slide-in-from-right-4 animate-in duration-300">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-400/20">
                  <Gift className="h-10 w-10 text-amber-400" />
                </div>
                <h1 className="mb-3 font-bold text-3xl text-white">Welcome!</h1>
                <p className="text-lg text-white/70">How would you like to participate?</p>
              </div>

              <div className="grid gap-4">
                <button
                  className={`rounded-2xl border-2 p-6 text-left transition-all ${
                    role === 'host'
                      ? 'border-amber-400 bg-amber-400/20'
                      : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                  }`}
                  onClick={() => setRole('host')}
                  type="button"
                >
                  <div className="mb-2 font-bold text-white text-xl">Be a Host</div>
                  <p className="text-white/70">
                    Open your home and share your celebration with guests
                  </p>
                </button>

                <button
                  className={`rounded-2xl border-2 p-6 text-left transition-all ${
                    role === 'guest'
                      ? 'border-amber-400 bg-amber-400/20'
                      : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                  }`}
                  onClick={() => setRole('guest')}
                  type="button"
                >
                  <div className="mb-2 font-bold text-white text-xl">Be a Guest</div>
                  <p className="text-white/70">Find a welcoming home to celebrate with</p>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Basic Info */}
          {step === 2 && (
            <div className="fade-in slide-in-from-right-4 animate-in duration-300">
              <div className="mb-8 text-center">
                <h1 className="mb-3 font-bold text-3xl text-white">Tell us about yourself</h1>
                <p className="text-lg text-white/70">
                  Help others get to know you before connecting
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="mb-2 block text-white/90">Your name</Label>
                  <Input
                    className="h-14 border-white/20 bg-white/10 text-lg text-white placeholder:text-white/40"
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    value={firstName}
                  />
                </div>

                <div>
                  <Label className="mb-2 block text-white/90">City</Label>
                  <select
                    className="h-14 w-full rounded-md border border-white/20 bg-white/10 px-4 text-lg text-white"
                    onChange={(e) => setCity(e.target.value)}
                    value={city}
                  >
                    {CITIES.map((c) => (
                      <option className="bg-green-900 text-white" key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="mb-2 block text-white/90">About you</Label>
                  <textarea
                    className="w-full resize-none rounded-md border border-white/20 bg-white/10 px-4 py-3 text-lg text-white placeholder:text-white/40"
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Share a bit about yourself..."
                    rows={4}
                    value={bio}
                  />
                  <p className="mt-1 text-sm text-white/50">{bio.length}/10 characters minimum</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <div className="fade-in slide-in-from-right-4 animate-in duration-300">
              <div className="mb-8 text-center">
                <h1 className="mb-3 font-bold text-3xl text-white">Your preferences</h1>
                <p className="text-lg text-white/70">Help us find the right match for you</p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="mb-3 block text-white/90">Languages you speak</Label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        className={`rounded-full px-4 py-2 text-sm transition-all ${
                          languages.includes(lang)
                            ? 'bg-amber-400 font-medium text-green-900'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                        key={lang}
                        onClick={() => toggleItem(languages, setLanguages, lang)}
                        type="button"
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block text-white/90">Available dates</Label>
                  <div className="flex flex-wrap gap-2">
                    {HOLIDAY_DATES.map((date) => (
                      <button
                        className={`rounded-full px-4 py-2 text-sm transition-all ${
                          availableDates.includes(date)
                            ? 'bg-amber-400 font-medium text-green-900'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                        key={date}
                        onClick={() => toggleItem(availableDates, setAvailableDates, date)}
                        type="button"
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block text-white/90">Dietary needs (optional)</Label>
                  <div className="flex flex-wrap gap-2">
                    {DIETARY_OPTIONS.map((diet) => (
                      <button
                        className={`rounded-full px-3 py-1.5 text-sm transition-all ${
                          dietary.includes(diet)
                            ? 'bg-orange-400 font-medium text-green-900'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                        key={diet}
                        onClick={() => toggleItem(dietary, setDietary, diet)}
                        type="button"
                      >
                        {diet}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Vibes */}
          {step === 4 && (
            <div className="fade-in slide-in-from-right-4 animate-in duration-300">
              <div className="mb-8 text-center">
                <h1 className="mb-3 font-bold text-3xl text-white">Almost done!</h1>
                <p className="text-lg text-white/70">
                  What kind of celebration are you looking for?
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="mb-3 block text-white/90">Vibe you're looking for</Label>
                  <div className="flex flex-wrap gap-2">
                    {VIBES_OPTIONS.map((vibe) => (
                      <button
                        className={`rounded-full px-4 py-2 text-sm transition-all ${
                          vibes.includes(vibe)
                            ? 'bg-purple-400 font-medium text-green-900'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                        key={vibe}
                        onClick={() => toggleItem(vibes, setVibes, vibe)}
                        type="button"
                      >
                        {vibe}
                      </button>
                    ))}
                  </div>
                </div>

                {role === 'host' && (
                  <div>
                    <Label className="mb-3 block text-white/90">Type of event</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {CONCEPTS.map((c) => (
                        <button
                          className={`rounded-xl border-2 p-4 text-center transition-all ${
                            concept === c
                              ? 'border-amber-400 bg-amber-400/20'
                              : 'border-white/20 bg-white/5 hover:border-white/40'
                          }`}
                          key={c}
                          onClick={() => setConcept(c)}
                          type="button"
                        >
                          <span className="font-medium text-white">{c}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="flex items-center justify-between px-6 py-6">
        <Button
          className="gap-2 border-white/20 bg-transparent text-white hover:bg-white/10"
          disabled={step === 1}
          onClick={() => setStep((s) => s - 1)}
          variant="outline"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>

        {step < TOTAL_STEPS ? (
          <Button
            className="gap-2 bg-amber-400 text-green-900 hover:bg-amber-300"
            disabled={!canProceed()}
            onClick={() => setStep((s) => s + 1)}
          >
            Continue <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            className="gap-2 bg-amber-400 text-green-900 hover:bg-amber-300"
            onClick={handleComplete}
          >
            Create Profile
          </Button>
        )}
      </div>
    </div>
  );
}
