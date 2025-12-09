"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Bell, Key, LogOut, Shield, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useLocale } from "@/contexts/locale-context";
import { api } from "@/convex/_generated/api";

export default function SettingsPage() {
  const { t } = useLocale();
  const { user } = useUser();
  const profile = useQuery(api.profiles.getMyProfile);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="font-bold text-2xl">{t.settingsTitle}</h1>
          <p className="text-muted-foreground text-sm">
            {t.manageProfileAndAccount}
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Link Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t.navProfile}</CardTitle>
              <CardDescription>
                Edit your profile information directly on your profile page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href={
                  profile?.username ? `/people/${profile.username}` : "/profile"
                }
              >
                <Button variant="outline">Go to Profile</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>{t.accountSettings}</CardTitle>
              <CardDescription>{t.manageAccountPreferences}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t.email}</Label>
                  <p className="text-muted-foreground text-sm">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
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
                <div className="space-y-0.5">
                  <Label className="text-base">{t.profileVisibility}</Label>
                  <p className="text-muted-foreground text-sm">
                    {t.makeProfileVisible}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t.securitySettings}
              </CardTitle>
              <CardDescription>{t.manageAccountSecurity}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t.password}</Label>
                  <p className="text-muted-foreground text-sm">
                    {t.managedBy}{" "}
                    {user?.primaryEmailAddress?.emailAddress?.includes("gmail")
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
                <div className="space-y-0.5">
                  <Label className="text-base">{t.twoFactorAuth}</Label>
                  <p className="text-muted-foreground text-sm">
                    {t.addExtraSecurity}
                  </p>
                </div>
                <Badge variant="outline">{t.comingSoon}</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t.loginNotifications}</Label>
                  <p className="text-muted-foreground text-sm">
                    {t.getNotifiedOnLogin}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t.notificationPreferences}
              </CardTitle>
              <CardDescription>{t.chooseNotifications}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t.emailNotifications}</Label>
                  <p className="text-muted-foreground text-sm">
                    {t.receiveEmailNotifications}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t.newInvitationAlerts}</Label>
                  <p className="text-muted-foreground text-sm">
                    {t.getNotifiedOnInvitation}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t.messageNotifications}</Label>
                  <p className="text-muted-foreground text-sm">
                    {t.getNotifiedOnMessage}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t.matchNotifications}</Label>
                  <p className="text-muted-foreground text-sm">
                    {t.getNotifiedOnMatch}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t.marketingEmails}</Label>
                  <p className="text-muted-foreground text-sm">
                    {t.receiveMarketingEmails}
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">{t.dangerZone}</CardTitle>
              <CardDescription>{t.irreversibleActions}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
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
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
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
        </div>
      </div>
    </div>
  );
}
