// src/hooks/useProfile.ts
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type UseProfileProps = {
  userId: string;
  email: string;
  initialFullName: string;
  initialPhone: string;
};

export function useProfile({
  userId,
  email,
  initialFullName,
  initialPhone,
}: UseProfileProps) {
  const router = useRouter();
  const supabase = createClient();

  // Profile state
  const [fullName, setFullName] = useState(initialFullName);
  const [phone, setPhone] = useState(initialPhone);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Delete state
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const saveProfile = async () => {
    setIsSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim() || null,
        phone: phone.trim() || null,
      })
      .eq("id", userId);

    if (profileError) {
      setIsSavingProfile(false);
      setProfileError("Failed to save changes. Please try again.");
      return;
    }

    const { error: metaError } = await supabase.auth.updateUser({
      data: { full_name: fullName.trim() || null },
    });

    setIsSavingProfile(false);

    if (metaError) {
      console.error("Failed to sync name to auth metadata:", metaError.message);
    }

    setProfileSuccess("Profile updated successfully.");
    router.refresh();
  };

  const updatePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setIsUpdatingPassword(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (signInError) {
      setIsUpdatingPassword(false);
      setPasswordError("Current password is incorrect.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setIsUpdatingPassword(false);

    if (updateError) {
      setPasswordError("Failed to update password. Please try again.");
      return;
    }

    setPasswordSuccess("Password updated successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const deleteAccount = async () => {
    setIsDeletingAccount(true);

    const { error } = await supabase
      .from("profiles")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", userId);

    if (error) {
      setIsDeletingAccount(false);
      return;
    }

    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return {
    // Profile form
    fullName,
    setFullName,
    phone,
    setPhone,
    isSavingProfile,
    profileSuccess,
    profileError,
    saveProfile,

    // Password form
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

    // Delete account
    isDeletingAccount,
    showDeleteConfirm,
    setShowDeleteConfirm,
    deleteAccount,
  };
}
