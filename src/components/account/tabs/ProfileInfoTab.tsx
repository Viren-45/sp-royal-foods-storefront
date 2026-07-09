// src/components/account/tabs/ProfileInfoTab.tsx
"use client";

import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProfileInfoTabProps = {
  userId: string;
  email: string;
  initialFullName: string;
  initialPhone: string;
};

export default function ProfileInfoTab({
  userId,
  email,
  initialFullName,
  initialPhone,
}: ProfileInfoTabProps) {
  const {
    fullName,
    setFullName,
    phone,
    setPhone,
    isSavingProfile,
    profileSuccess,
    profileError,
    saveProfile,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isUpdatingPassword,
    passwordSuccess,
    passwordError,
    updatePassword,
    isDeletingAccount,
    showDeleteConfirm,
    setShowDeleteConfirm,
    deleteAccount,
  } = useProfile({ userId, email, initialFullName, initialPhone });

  return (
    <div className="space-y-8">
      {/* Profile Information */}
      <section className="rounded-2xl border border-[#D8D6C0] bg-white p-6 sm:p-8">
        <h2 className="font-heading text-2xl font-medium text-[#1B1B1B]">
          Profile Information
        </h2>
        <p className="mt-1 text-sm text-[#5C5C4E]">
          Update your name and phone number.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveProfile();
          }}
          className="mt-6 space-y-5"
        >
          <div>
            <Label htmlFor="fullName" className="text-[#1B1B1B]">
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className="mt-1.5 border-[#D8D6C0] py-5"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-[#1B1B1B]">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="mt-1.5 cursor-not-allowed border-[#D8D6C0] py-5 opacity-60"
            />
            <p className="mt-1.5 text-xs text-[#5C5C4E]">
              Email address cannot be changed.
            </p>
          </div>

          <div>
            <Label htmlFor="phone" className="text-[#1B1B1B]">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 00000 00000"
              className="mt-1.5 border-[#D8D6C0] py-5"
            />
          </div>

          {profileError && (
            <p className="text-sm text-[#C0392B]">{profileError}</p>
          )}
          {profileSuccess && (
            <p className="text-sm text-[#2F7A3D]">{profileSuccess}</p>
          )}

          <Button
            type="submit"
            disabled={isSavingProfile}
            className="bg-[#1F3D2E] py-5 text-white hover:opacity-90"
          >
            {isSavingProfile ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </section>

      {/* Change Password */}
      <section className="rounded-2xl border border-[#D8D6C0] bg-white p-6 sm:p-8">
        <h2 className="font-heading text-2xl font-medium text-[#1B1B1B]">
          Change Password
        </h2>
        <p className="mt-1 text-sm text-[#5C5C4E]">
          Choose a strong password of at least 8 characters.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            updatePassword();
          }}
          className="mt-6 space-y-5"
        >
          <div>
            <Label htmlFor="currentPassword" className="text-[#1B1B1B]">
              Current Password
            </Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              className="mt-1.5 border-[#D8D6C0] py-5"
            />
          </div>

          <div>
            <Label htmlFor="newPassword" className="text-[#1B1B1B]">
              New Password
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              className="mt-1.5 border-[#D8D6C0] py-5"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-[#1B1B1B]">
              Confirm New Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="mt-1.5 border-[#D8D6C0] py-5"
            />
          </div>

          {passwordError && (
            <p className="text-sm text-[#C0392B]">{passwordError}</p>
          )}
          {passwordSuccess && (
            <p className="text-sm text-[#2F7A3D]">{passwordSuccess}</p>
          )}

          <Button
            type="submit"
            disabled={isUpdatingPassword}
            className="bg-[#1F3D2E] py-5 text-white hover:opacity-90"
          >
            {isUpdatingPassword ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </section>

      {/* Danger Zone */}
      <section className="rounded-2xl border border-[#C0392B]/30 bg-white p-6 sm:p-8">
        <h2 className="font-heading text-2xl font-medium text-[#C0392B]">
          Danger Zone
        </h2>
        <p className="mt-1 text-sm text-[#5C5C4E]">
          Deleting your account is permanent and cannot be undone. Your order
          history will be retained for record-keeping purposes.
        </p>

        {!showDeleteConfirm ? (
          <Button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            variant="outline"
            className="mt-6 border-[#C0392B] text-[#C0392B] hover:bg-[#C0392B]/5"
          >
            Delete Account
          </Button>
        ) : (
          <div className="mt-6 rounded-xl bg-[#C0392B]/5 p-4">
            <p className="text-sm font-medium text-[#C0392B]">
              Are you sure? This action cannot be undone.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Button
                type="button"
                onClick={deleteAccount}
                disabled={isDeletingAccount}
                className="bg-[#C0392B] text-white hover:opacity-90"
              >
                {isDeletingAccount ? "Deleting..." : "Yes, Delete My Account"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="border-[#D8D6C0] text-[#1B1B1B]"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
