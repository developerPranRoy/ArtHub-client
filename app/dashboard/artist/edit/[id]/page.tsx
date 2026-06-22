"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Input, Textarea, Button, Card, CardBody } from "@heroui/react";
import api from "../../../../../lib/api";
import { uploadImage } from "../../../../../lib/uploadImage";
import ProtectedRoute from "../../../../../components/ProtectedRoute";
import { Spinner } from "../../../../../components/Loaders";
import { Artwork } from "../../../../../lib/types";

const CATEGORIES = ["Painting", "Digital", "Sculpture", "Photography", "Illustration"];

function EditArtworkForm() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [form, setForm] = useState<Artwork | null>(null);
  const [preview, setPreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/artworks/${id}`)
      .then((res) => {
        setForm(res.data);
        setPreview(res.data.image);
      })
      .finally(() => setLoading(false));
  }, [id]);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      let imageUrl = form.image;
      if (imageFile) imageUrl = await uploadImage(imageFile);
      await api.patch(`/artworks/${id}`, { ...form, image: imageUrl });
      toast.success("Artwork updated");
      router.push("/dashboard/artist");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Could not update artwork");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !form) return <Spinner />;

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-ink">Edit Artwork</h1>
      <Card>
        <CardBody className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Artwork Image</label>
              {preview && <img src={preview} alt="preview" className="mb-2 h-40 w-full rounded-xl object-cover" />}
              <input type="file" accept="image/*" onChange={handleFile} className="text-sm" />
            </div>
            <Input label="Title" isRequired value={form.title} onValueChange={(v) => setForm({ ...form, title: v })} />
            <Textarea label="Description" isRequired minRows={4} value={form.description} onValueChange={(v) => setForm({ ...form, description: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Input type="number" label="Price ($)" isRequired min={1} value={String(form.price)} onValueChange={(v) => setForm({ ...form, price: Number(v) })} />
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Button type="submit" color="secondary" className="w-full" isLoading={saving}>Save Changes</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default function EditArtworkPage() {
  return (
    <ProtectedRoute allowedRoles={["artist"]}>
      <EditArtworkForm />
    </ProtectedRoute>
  );
}
