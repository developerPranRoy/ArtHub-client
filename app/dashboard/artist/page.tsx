"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button, Card } from "@heroui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import api from "../../../lib/api";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { TableRowSkeleton } from "../../../components/Loaders";
import { Artwork, Transaction } from "../../../lib/types";

function ArtistDashboardContent() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [sales, setSales] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/artworks/mine/list"), api.get("/transactions/sales")])
      .then(([aRes, sRes]) => {
        setArtworks(aRes.data);
        setSales(sRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this artwork?")) return;
    try {
      await api.delete(`/artworks/${id}`);
      setArtworks((a) => a.filter((art) => art._id !== id));
      toast.success("Deleted");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Could not delete");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Artist Dashboard</h1>
        <Button as={Link} href="/dashboard/artist/add" color="secondary" startContent={<PlusIcon className="h-4 w-4" />}>
          Add Artwork
        </Button>
      </div>

      <h2 className="mb-3 text-xl font-bold text-ink">My Artworks</h2>
      <Card className="mb-10 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-50 text-ink/70">
            <tr><th className="p-3">Title</th><th className="p-3">Price</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <TableRowSkeleton key={i} cols={4} />)
            ) : artworks.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center text-ink/50">No artworks yet. Add your first one!</td></tr>
            ) : (
              artworks.map((a) => (
                <tr key={a._id} className="border-t border-black/5">
                  <td className="p-3">{a.title}</td>
                  <td className="p-3">${a.price}</td>
                  <td className="p-3">{a.sold ? "Sold" : "Available"}</td>
                  <td className="p-3 space-x-3">
                    <Link href={`/dashboard/artist/edit/${a._id}`} className="text-brand-700">Edit</Link>
                    <button onClick={() => handleDelete(a._id)} className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      <h2 className="mb-3 text-xl font-bold text-ink">Sales History</h2>
      <Card className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-50 text-ink/70">
            <tr><th className="p-3">Artwork</th><th className="p-3">Amount</th><th className="p-3">Date</th></tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <TableRowSkeleton key={i} cols={3} />)
            ) : sales.length === 0 ? (
              <tr><td colSpan={3} className="p-4 text-center text-ink/50">No sales yet.</td></tr>
            ) : (
              sales.map((s) => (
                <tr key={s._id} className="border-t border-black/5">
                  <td className="p-3">{s.artworkTitle}</td>
                  <td className="p-3">${s.amount}</td>
                  <td className="p-3">{new Date(s.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      <div className="mt-6">
        <Button as={Link} href="/dashboard/artist/profile" variant="bordered" color="secondary">Edit Profile</Button>
      </div>
    </div>
  );
}

export default function ArtistDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["artist"]}>
      <ArtistDashboardContent />
    </ProtectedRoute>
  );
}
