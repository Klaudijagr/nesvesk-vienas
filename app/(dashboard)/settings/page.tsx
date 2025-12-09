"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import {
  Bell,
  Key,
  Loader2,
  LogOut,
  Save,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PhotoGallery } from "@/components/PhotoGallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "@/contexts/locale-context";
import { api } from "@/convex/_generated/api";
import { CITIES, HOLIDAY_DATES, LANGUAGES } from "@/lib/types";

export default function SettingsPage() {
  const { t } = useLocale();
  const { user } = useUser();
  const profile = useQuery(api.profiles.getMyProfile);
  const upsertProfile = useMutation(api.profiles.upsertProfile);

  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    role: "guest" as "host" | "guest" | "both",
    firstName: "",
    lastName: "",
    age: "" as string | number,
    city: "Vilnius" as (typeof CITIES)[number],
    bio: "",
    languages: [] as (typeof LANGUAGES)[number][],
    availableDates: [] as (typeof HOLIDAY_DATES)[number][],
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        role: profile.role,
        firstName: profile.firstName,
        lastName: profile.lastName || "",
        age: profile.age || "",
        city: profile.city,
        bio: profile.bio,
        languages: profile.languages,
        availableDates: profile.availableDates,
      });
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await upsertProfile({
        role: formData.role,
        firstName: formData.firstName,
        lastName: formData.lastName || undefined,
        age:
          typeof formData.age === "number"
            ? formData.age
            : Number.parseInt(formData.age as string, 10) || undefined,
        city: formData.city,
        bio: formData.bio,
        languages: formData.languages,
        availableDates: formData.availableDates,
        dietaryInfo: profile?.dietaryInfo || [],
        amenities: profile?.amenities || [],
        houseRules: profile?.houseRules || [],
        vibes: profile?.vibes || [],
        smokingAllowed: profile?.smokingAllowed ?? false,
        drinkingAllowed: true,
        petsAllowed: profile?.petsAllowed ?? false,
        hasPets: profile?.hasPets ?? false,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleLanguage = (lang: (typeof LANGUAGES)[number]) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const toggleDate = (date: (typeof HOLIDAY_DATES)[number]) => {
    setFormData((prev) => ({
      ...prev,
      availableDates: prev.availableDates.includes(date)
        ? prev.availableDates.filter((d) => d !== date)
        : [...prev.availableDates, date],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-1 font-bold text-2xl">{t.settingsTitle}</h1>
        <p className="mb-4 text-muted-foreground text-sm">
          {t.manageProfileAndAccount}
        </p>

        <Tabs className="space-y-4" defaultValue="profile">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              {t.profile}
            </TabsTrigger>
            <TabsTrigger value="account">
              <User className="mr-2 h-4 w-4" />
              {t.account}
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="mr-2 h-4 w-4" />
              {t.security}
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              {t.notifications}
            </TabsTrigger>
          </TabsList>

          <TabsContent className="space-y-4" value="profile">
            <Card>
              <CardHeader>
                <CardTitle>{t.profileInformation}</CardTitle>
                <CardDescription>{t.updateYourPublicProfile}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <PhotoGallery fallbackPhotoUrl={user?.imageUrl} />

                <Separator />

                <div className="space-y-1">
                  <Label>{t.iWantToBe}</Label>
                  <div className="flex gap-2">
                    {(["guest", "host", "both"] as const).map((r) => (
                      <Button
                        key={r}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, role: r }))
                        }
                        type="button"
                        variant={formData.role === r ? "default" : "outline"}
                      >
                        {r === "guest"
                          ? t.guest
                          : r === "host"
                            ? t.host
                            : t.both}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  {/* Left column: Name + Age/City */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="firstName">{t.firstName}</Label>
                        <Input
                          id="firstName"
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
                          value={formData.firstName}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="lastName">{t.lastName}</Label>
                        <Input
                          id="lastName"
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              lastName: e.target.value,
                            }))
                          }
                          value={formData.lastName}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="age">{t.age}</Label>
                        <Input
                          id="age"
                          max={120}
                          min={18}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              age: e.target.value,
                            }))
                          }
                          type="number"
                          value={formData.age}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="city">{t.city}</Label>
                        <select
                          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                          id="city"
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              city: e.target.value as (typeof CITIES)[number],
                            }))
                          }
                          value={formData.city}
                        >
                          {CITIES.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Right column: Bio */}
                  <div className="space-y-1">
                    <Label htmlFor="bio">{t.bio}</Label>
                    <Textarea
                      className="h-[106px] resize-none"
                      id="bio"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      placeholder={t.tellOthersAboutYourself}
                      value={formData.bio}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-1">
                  <Label>{t.languages}</Label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map((lang) => (
                      <Button
                        key={lang}
                        onClick={() => toggleLanguage(lang)}
                        size="sm"
                        type="button"
                        variant={
                          formData.languages.includes(lang)
                            ? "default"
                            : "outline"
                        }
                      >
                        {lang}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label>{t.availableDates}</Label>
                  <div className="flex flex-wrap gap-2">
                    {HOLIDAY_DATES.map((date) => (
                      <Button
                        key={date}
                        onClick={() => toggleDate(date)}
                        size="sm"
                        type="button"
                        variant={
                          formData.availableDates.includes(date)
                            ? "default"
                            : "outline"
                        }
                      >
                        {date}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button disabled={isSaving} onClick={handleSaveProfile}>
                    {isSaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    {t.saveChanges}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.identityVerification}</CardTitle>
                <CardDescription>{t.verifyYourIdentity}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm">
                      {profile?.verified
                        ? t.yourIdentityVerified
                        : t.verifyWithPhoto}
                    </p>
                  </div>
                  {profile?.verified ? (
                    <Badge
                      className="border-green-200 bg-green-50 text-green-700"
                      variant="outline"
                    >
                      {t.verified}
                    </Badge>
                  ) : (
                    <Link href="/verify">
                      <Button>{t.verifyNow}</Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent className="space-y-4" value="account">
            <Card>
              <CardHeader>
                <CardTitle>{t.accountSettings}</CardTitle>
                <CardDescription>{t.manageAccountPreferences}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">{t.email}</Label>
                    <p className="text-muted-foreground text-sm">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">{t.accountStatus}</Label>
                    <p className="text-muted-foreground text-sm">
                      {t.accountCurrentlyActive}
                    </p>
                  </div>
                  <Badge
                    className="border-green-200 bg-green-50 text-green-700"
                    variant="outline"
                  >
                    {t.active}
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">{t.profileVisibility}</Label>
                    <p className="text-muted-foreground text-sm">
                      {t.makeProfileVisible}
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">
                  {t.dangerZone}
                </CardTitle>
                <CardDescription>{t.irreversibleActions}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">{t.signOutLabel}</Label>
                    <p className="text-muted-foreground text-sm">
                      {t.signOutFromAccount}
                    </p>
                  </div>
                  <SignOutButton>
                    <Button variant="outline">
                      <LogOut className="mr-2 h-4 w-4" />
                      {t.signOutLabel}
                    </Button>
                  </SignOutButton>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">{t.deleteAccount}</Label>
                    <p className="text-muted-foreground text-sm">
                      {t.permanentlyDeleteAccount}
                    </p>
                  </div>
                  <Button disabled variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t.deleteAccount}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent className="space-y-4" value="security">
            <Card>
              <CardHeader>
                <CardTitle>{t.securitySettings}</CardTitle>
                <CardDescription>{t.manageAccountSecurity}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">{t.password}</Label>
                    <p className="text-muted-foreground text-sm">
                      {t.managedBy}{" "}
                      {user?.primaryEmailAddress?.emailAddress?.includes(
                        "gmail"
                      )
                        ? t.google
                        : t.yourAuthProvider}
                    </p>
                  </div>
                  <Button disabled variant="outline">
                    <Key className="mr-2 h-4 w-4" />
                    {t.changePassword}
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">{t.twoFactorAuth}</Label>
                    <p className="text-muted-foreground text-sm">
                      {t.addExtraSecurity}
                    </p>
                  </div>
                  <Badge variant="outline">{t.comingSoon}</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">{t.loginNotifications}</Label>
                    <p className="text-muted-foreground text-sm">
                      {t.getNotifiedOnLogin}
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent className="space-y-4" value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>{t.notificationPreferences}</CardTitle>
                <CardDescription>{t.chooseNotifications}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">{t.emailNotifications}</Label>
                    <p className="text-muted-foreground text-sm">
                      {t.receiveEmailNotifications}
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">{t.newInvitationAlerts}</Label>
                    <p className="text-muted-foreground text-sm">
                      {t.getNotifiedOnInvitation}
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">
                      {t.messageNotifications}
                    </Label>
                    <p className="text-muted-foreground text-sm">
                      {t.getNotifiedOnMessage}
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">{t.matchNotifications}</Label>
                    <p className="text-muted-foreground text-sm">
                      {t.getNotifiedOnMatch}
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">{t.marketingEmails}</Label>
                    <p className="text-muted-foreground text-sm">
                      {t.receiveMarketingEmails}
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
