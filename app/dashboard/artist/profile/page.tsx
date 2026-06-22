"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import toast from "react-hot-toast";
import { Input, Button, Card, CardBody, Avatar } from "@heroui/react";
import api from "../../../../lib/api";
import { uploadImage } from "../../../../lib/uploadImage";
import { useAuth } from "../../../../context/AuthContext";
import ProtectedRoute from "../../../../components/ProtectedRoute";

function ProfileForm() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [photo, setPhoto] = useState(user?.photo || "");
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [saving, setSaving] = useState(false);

  async function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setPhoto(url);
    } catch {
      toast.error("Image upload failed");
    }
  }

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.patch("/users/me", { name, photo });
      setUser(res.data);
      toast.success("Profile updated");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function changePassword(e: FormEvent) {
    e.preventDefault();
    try {
      await api.patch("/users/me/password", passwords);
      toast.success("Password changed");
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Could not change password");
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-8 px-4 py-10">
      <h1 className="text-2xl font-bold text-ink">Profile Settings</h1>

      <Card>
        <CardBody className="p-6">
          <form onSubmit={saveProfile} className="space-y-4">
            <div>
              <label className="label">Profile Photo</label>
              <Avatar src={photo} name={name} className="mb-2 h-20 w-20" />
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="text-sm" />
            </div>
            <Input label="Full Name" value={name} onValueChange={setName} />
            <Button type="submit" color="secondary" isLoading={saving}>Save Changes</Button>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="p-6">
          <form onSubmit={changePassword} className="space-y-4">
            <h2 className="font-semibold text-ink">Change Password</h2>
            <Input
              type="password"
              label="Current password"
              value={passwords.currentPassword}
              onValueChange={(v) => setPasswords({ ...passwords, currentPassword: v })}
            />
            <Input
              type="password"
              label="New password"
              value={passwords.newPassword}
              onValueChange={(v) => setPasswords({ ...passwords, newPassword: v })}
            />
            <Button type="submit" variant="bordered" color="secondary">Update Password</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default function ArtistProfilePage() {
  return (
    <ProtectedRoute allowedRoles={["artist"]}>
      <ProfileForm />
    </ProtectedRoute>
  );
}
