"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Input, Textarea, Button, Card, CardBody } from "@heroui/react";
import api from "../../../../lib/api";
import { uploadImage } from "../../../../lib/uploadImage";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import { useAuth } from "../../../../context/AuthContext";

const CATEGORIES = ["Painting", "Digital", "Sculpture", "Photography", "Illustration"];

function AddArtworkForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [form, setForm] = useState({ title: "", description: "", price: "", category: CATEGORIES[0] });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!imageFile) return toast.error("Please select an image");
    setSaving(true);
    try {
      const imageUrl = await uploadImage(imageFile);
      await api.post("/artworks", { ...form, image: imageUrl, artistName: user?.name });
      toast.success("Artwork published!");
      router.push("/dashboard/artist");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Could not publish artwork");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-ink">Add New Artwork</h1>
      <Card>
        <CardBody className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Artwork Image</label>
              {preview && <img src={preview} alt="preview" className="mb-2 h-40 w-full rounded-xl object-cover" />}
              <input type="file" accept="image/*" onChange={handleFile} className="text-sm" required />
            </div>
            <Input label="Title" isRequired value={form.title} onValueChange={(v) => setForm({ ...form, title: v })} />
            <Textarea label="Description" isRequired minRows={4} value={form.description} onValueChange={(v) => setForm({ ...form, description: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Input type="number" label="Price ($)" isRequired min={1} value={form.price} onValueChange={(v) => setForm({ ...form, price: v })} />
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Button type="submit" color="secondary" className="w-full" isLoading={saving}>Publish Artwork</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default function AddArtworkPage() {
  return (
    <ProtectedRoute allowedRoles={["artist"]}>
      <AddArtworkForm />
    </ProtectedRoute>
  );
}
