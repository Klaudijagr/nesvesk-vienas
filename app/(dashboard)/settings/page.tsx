"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import { useAction, useMutation, useQuery } from "convex/react";
import { Bell, Key, Loader2, LogOut, Shield, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { useLocale } from "@/contexts/locale-context";
import { api } from "@/convex/_generated/api";

/**
 * Render the settings page for managing profile, account, security, notification preferences, and account deletion.
 *
 * The page fetches profile and user data, allows toggling notification preferences, provides links to edit and view the profile,
 * exposes security and account settings, and includes a dialog-driven flow to delete the user account.
 *
 * @returns The settings page React element
 */
export default function SettingsPage() {
  const { t } = useLocale();
  const { user } = useUser();
  const router = useRouter();
  const profile = useQuery(api.profiles.getMyProfile);
  const currentUser = useQuery(api.users.current);
  const deleteUser = useAction(api.users.deleteUser);
  const updateNotificationPreferences = useMutation(
    api.profiles.updateNotificationPreferences
  );

  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Notification handlers
  const handleNotificationChange = async (
    field:
      | "emailNotifications"
      | "notifyOnInvitation"
      | "notifyOnMessage"
      | "notifyOnMatch"
      | "marketingEmails",
    value: boolean
  ) => {
    try {
      await updateNotificationPreferences({ [field]: value });
    } catch (_error) {
      toast.error("Failed to update notification preferences");
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser?._id) {
      toast.error("Unable to delete account. Please try again.");
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteUser({ userId: currentUser._id });
      if (result.success) {
        toast.success("Account deleted successfully");
        router.push("/");
      } else {
        toast.error(result.error || "Failed to delete account");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete account"
      );
    } finally {
      setIsDeleting(false);
      setDialogOpen(false);
    }
  };

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
          {/* Profile Edit Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t.navProfile}</CardTitle>
              <CardDescription>
                Edit your profile information, preferences, and photos
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Link href="/settings/edit-profile">
                <Button>Edit Profile</Button>
              </Link>
              <Link
                href={
                  profile?.username ? `/people/${profile.username}` : "/profile"
                }
              >
                <Button variant="outline">View Profile</Button>
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
                <Switch
                  checked={profile?.emailNotifications ?? true}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("emailNotifications", checked)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t.newInvitationAlerts}</Label>
                  <p className="text-muted-foreground text-sm">
                    {t.getNotifiedOnInvitation}
                  </p>
                </div>
                <Switch
                  checked={profile?.notifyOnInvitation ?? true}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("notifyOnInvitation", checked)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t.messageNotifications}</Label>
                  <p className="text-muted-foreground text-sm">
                    {t.getNotifiedOnMessage}
                  </p>
                </div>
                <Switch
                  checked={profile?.notifyOnMessage ?? true}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("notifyOnMessage", checked)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t.matchNotifications}</Label>
                  <p className="text-muted-foreground text-sm">
                    {t.getNotifiedOnMatch}
                  </p>
                </div>
                <Switch
                  checked={profile?.notifyOnMatch ?? true}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("notifyOnMatch", checked)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t.marketingEmails}</Label>
                  <p className="text-muted-foreground text-sm">
                    {t.receiveMarketingEmails}
                  </p>
                </div>
                <Switch
                  checked={profile?.marketingEmails ?? false}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("marketingEmails", checked)
                  }
                />
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
                <SignOutButton redirectUrl="/">
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
                <DeleteAccountDialog
                  confirmText={confirmText}
                  isDeleting={isDeleting}
                  onConfirm={handleDeleteAccount}
                  onConfirmTextChange={setConfirmText}
                  onOpenChange={setDialogOpen}
                  open={dialogOpen}
                  t={t}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DeleteAccountDialog({
  open,
  onOpenChange,
  confirmText,
  onConfirmTextChange,
  isDeleting,
  onConfirm,
  t,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  confirmText: string;
  onConfirmTextChange: (text: string) => void;
  isDeleting: boolean;
  onConfirm: () => void;
  t: ReturnType<typeof useLocale>["t"];
}) {
  const isConfirmValid = confirmText === "DELETE";

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          {t.deleteAccount}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <span className="block">
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers, including:
            </span>
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>Your profile and photos</li>
              <li>All your messages and conversations</li>
              <li>Your connection history</li>
              <li>Any pending invitations</li>
            </ul>
            <span className="block pt-2">
              Type <strong>DELETE</strong> to confirm:
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          onChange={(e) => onConfirmTextChange(e.target.value)}
          placeholder="Type DELETE to confirm"
          value={confirmText}
        />
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button
            disabled={!isConfirmValid || isDeleting}
            onClick={onConfirm}
            variant="destructive"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Account"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}