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
import { api } from "@/convex/_generated/api";
import { CITIES, HOLIDAY_DATES, LANGUAGES } from "@/lib/types";

export default function SettingsPage() {
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
        <h1 className="mb-1 font-bold text-2xl">Settings</h1>
        <p className="mb-4 text-muted-foreground text-sm">
          Manage your profile and account
        </p>

        <Tabs className="space-y-4" defaultValue="profile">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="account">
              <User className="mr-2 h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent className="space-y-4" value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your public profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <PhotoGallery fallbackPhotoUrl={user?.imageUrl} />

                <Separator />

                <div className="space-y-1">
                  <Label>I want to be a</Label>
                  <div className="flex gap-2">
                    {(["guest", "host", "both"] as const).map((r) => (
                      <Button
                        className="capitalize"
                        key={r}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, role: r }))
                        }
                        type="button"
                        variant={formData.role === r ? "default" : "outline"}
                      >
                        {r}
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
                        <Label htmlFor="firstName">First Name</Label>
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
                        <Label htmlFor="lastName">Last Name</Label>
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
                        <Label htmlFor="age">Age</Label>
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
                        <Label htmlFor="city">City</Label>
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
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      className="h-[106px] resize-none"
                      id="bio"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      placeholder="Tell others about yourself..."
                      value={formData.bio}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-1">
                  <Label>Languages</Label>
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
                  <Label>Available Dates</Label>
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
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Identity Verification</CardTitle>
                <CardDescription>
                  Verify your identity to build trust
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm">
                      {profile?.verified
                        ? "Your identity has been verified"
                        : "Verify your identity with a photo"}
                    </p>
                  </div>
                  {profile?.verified ? (
                    <Badge
                      className="border-green-200 bg-green-50 text-green-700"
                      variant="outline"
                    >
                      Verified
                    </Badge>
                  ) : (
                    <Link href="/verify">
                      <Button>Verify Now</Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent className="space-y-4" value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">Email</Label>
                    <p className="text-muted-foreground text-sm">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">Account Status</Label>
                    <p className="text-muted-foreground text-sm">
                      Your account is currently active
                    </p>
                  </div>
                  <Badge
                    className="border-green-200 bg-green-50 text-green-700"
                    variant="outline"
                  >
                    Active
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">Profile Visibility</Label>
                    <p className="text-muted-foreground text-sm">
                      Make your profile visible to other users
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">Sign Out</Label>
                    <p className="text-muted-foreground text-sm">
                      Sign out from your account
                    </p>
                  </div>
                  <SignOutButton>
                    <Button variant="outline">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </SignOutButton>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">Delete Account</Label>
                    <p className="text-muted-foreground text-sm">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button disabled variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent className="space-y-4" value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">Password</Label>
                    <p className="text-muted-foreground text-sm">
                      Managed by{" "}
                      {user?.primaryEmailAddress?.emailAddress?.includes(
                        "gmail"
                      )
                        ? "Google"
                        : "your auth provider"}
                    </p>
                  </div>
                  <Button disabled variant="outline">
                    <Key className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-muted-foreground text-sm">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">Login Notifications</Label>
                    <p className="text-muted-foreground text-sm">
                      Get notified when someone logs in
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
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-muted-foreground text-sm">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">New Invitation Alerts</Label>
                    <p className="text-muted-foreground text-sm">
                      Get notified when you receive an invitation
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">Message Notifications</Label>
                    <p className="text-muted-foreground text-sm">
                      Get notified when you receive new messages
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">Match Notifications</Label>
                    <p className="text-muted-foreground text-sm">
                      Get notified when someone accepts your invitation
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">Marketing Emails</Label>
                    <p className="text-muted-foreground text-sm">
                      Receive emails about new features
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
