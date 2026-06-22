"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Card } from "@heroui/react";
import api from "../../../../lib/api";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import { TableRowSkeleton } from "../../../../components/Loaders";
import { Artwork } from "../../../../lib/types";

function ManageArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/artworks/admin/all").then((res) => setArtworks(res.data)).finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this artwork?")) return;
    try {
      await api.delete(`/artworks/${id}`);
      setArtworks((a) => a.filter((art) => art._id !== id));
      toast.success("Artwork deleted");
    } catch {
      toast.error("Could not delete artwork");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-ink">Manage Artworks</h1>
      <Card className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-50 text-ink/70">
            <tr><th className="p-3">Title</th><th className="p-3">Artist</th><th className="p-3">Price</th><th className="p-3">Actions</th></tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={4} />)
            ) : (
              artworks.map((a) => (
                <tr key={a._id} className="border-t border-black/5">
                  <td className="p-3">{a.title}</td>
                  <td className="p-3">{a.artistName}</td>
                  <td className="p-3">${a.price}</td>
                  <td className="p-3"><button onClick={() => handleDelete(a._id)} className="text-red-600">Delete</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default function ManageArtworksPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <ManageArtworks />
    </ProtectedRoute>
  );
}
