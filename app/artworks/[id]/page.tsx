"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button, Input, Chip, Card, CardBody } from "@heroui/react";
import api from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";
import { Spinner } from "../../../components/Loaders";
import { Artwork, Comment } from "../../../lib/types";

export default function ArtworkDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user } = useAuth();

  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.get(`/artworks/${id}`), api.get(`/artworks/${id}/comments`)])
      .then(([aRes, cRes]) => {
        setArtwork(aRes.data);
        setComments(cRes.data);
      })
      .catch(() => setNotFoundFlag(true))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!user || user.role !== "user") return;
    api
      .get("/transactions/mine")
      .then((res) => setHasPurchased(res.data.some((t: any) => t.artworkId === id || t.artworkId?.toString?.() === id)))
      .catch(() => {});
  }, [user, id]);

  async function handlePurchase() {
    setPurchasing(true);
    try {
      await api.post("/transactions/purchase", { artworkId: id });
      toast.success("Purchase successful!");
      const res = await api.get(`/artworks/${id}`);
      setArtwork(res.data);
      setHasPurchased(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Purchase failed");
    } finally {
      setPurchasing(false);
    }
  }

  async function handleDeleteArtwork() {
    if (!confirm("Delete this artwork permanently?")) return;
    try {
      await api.delete(`/artworks/${id}`);
      toast.success("Artwork deleted");
      router.push("/dashboard/artist");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  }

  async function submitComment(e: FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      if (editingId) {
        const res = await api.patch(`/artworks/${id}/comments/${editingId}`, { comment: commentText });
        setComments((c) => c.map((cm) => (cm._id === editingId ? res.data : cm)));
        setEditingId(null);
      } else {
        const res = await api.post(`/artworks/${id}/comments`, { comment: commentText });
        setComments((c) => [res.data, ...c]);
      }
      setCommentText("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Could not post comment");
    }
  }

  async function deleteComment(commentId: string) {
    try {
      await api.delete(`/artworks/${id}/comments/${commentId}`);
      setComments((c) => c.filter((cm) => cm._id !== commentId));
    } catch {
      toast.error("Could not delete comment");
    }
  }

  if (loading) return <Spinner />;
  if (notFoundFlag || !artwork) {
    return (
      <div className="py-20 text-center">
        <p className="text-xl font-semibold text-ink">Artwork not found</p>
        <Button as={Link} href="/browse" color="secondary" className="mt-4">Back to Browse</Button>
      </div>
    );
  }

  const ownerId = typeof artwork.artistId === "string" ? artwork.artistId : artwork.artistId._id;
  const isOwner = Boolean(user && ownerId === user._id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-brand-50 md:h-full">
          <Image src={artwork.image} alt={artwork.title} fill className="object-cover" unoptimized />
          {artwork.sold && (
            <Chip className="absolute right-3 top-3 bg-ink text-white">Sold</Chip>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-ink">{artwork.title}</h1>
          <p className="mt-1 text-ink/60">
            by <span className="font-medium text-brand-700">{artwork.artistName}</span>
          </p>
          <p className="mt-4 text-ink/80">{artwork.description}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Chip variant="flat" color="secondary">{artwork.category}</Chip>
            <Chip variant="flat">{new Date(artwork.createdAt).toLocaleDateString()}</Chip>
          </div>
          <p className="mt-6 text-3xl font-bold text-brand-700">${artwork.price}</p>

          {isOwner ? (
            <div className="mt-6 flex gap-3">
              <Button as={Link} href={`/dashboard/artist/edit/${artwork._id}`} variant="bordered" color="secondary">Edit</Button>
              <Button color="danger" onPress={handleDeleteArtwork}>Delete</Button>
            </div>
          ) : (
            <Button
              isDisabled={artwork.sold || purchasing || !user || user.role !== "user"}
              isLoading={purchasing}
              onPress={handlePurchase}
              color="secondary"
              className="mt-6"
            >
              {artwork.sold ? "Sold Out" : "Buy Now"}
            </Button>
          )}
        </div>
      </div>

      {/* Comments */}
      <div className="mt-12">
        <h2 className="mb-4 text-xl font-bold text-ink">Comments</h2>

        {hasPurchased ? (
          <form onSubmit={submitComment} className="mb-6 flex gap-3">
            <Input
              placeholder="Share your thoughts on this piece..."
              value={commentText}
              onValueChange={setCommentText}
            />
            <Button type="submit" color="secondary">{editingId ? "Update" : "Post"}</Button>
          </form>
        ) : (
          <p className="mb-6 text-sm text-ink/50">Only buyers of this artwork can leave a comment.</p>
        )}

        <div className="space-y-4">
          {comments.length === 0 && <p className="text-sm text-ink/50">No comments yet.</p>}
          {comments.map((c) => (
            <Card key={c._id}>
              <CardBody className="flex flex-row items-start justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-ink">{c.userName}</p>
                  <p className="mt-1 text-sm text-ink/70">{c.comment}</p>
                </div>
                {user && user._id === c.userId?.toString?.() && (
                  <div className="flex gap-2 text-xs">
                    <button onClick={() => { setEditingId(c._id); setCommentText(c.comment); }} className="text-brand-700">
                      Edit
                    </button>
                    <button onClick={() => deleteComment(c._id)} className="text-red-600">Delete</button>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
