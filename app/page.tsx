"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Avatar, Card } from "@heroui/react";
import api from "../lib/api";
import ArtworkCard from "../components/ArtworkCard";
import { ArtworkCardSkeleton } from "../components/Loaders";
import { Artwork } from "../lib/types";

const CATEGORIES = ["Painting", "Digital", "Sculpture", "Photography", "Illustration"];

interface TopArtist {
  _id: string;
  artistName: string;
  sales: number;
}

export default function HomePage() {
  const [featured, setFeatured] = useState<Artwork[]>([]);
  const [topArtists, setTopArtists] = useState<TopArtist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/artworks/featured"), api.get("/artworks/top-artists")])
      .then(([fRes, aRes]) => {
        setFeatured(fRes.data);
        setTopArtists(aRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-600 to-brand-800 px-4 py-24 text-center text-white">
        <h1 className="mx-auto max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
          Discover & Buy Original Art
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-brand-100">
          ArtHub connects you directly with talented independent artists from around the world.
        </p>
        <Button as={Link} href="/browse" className="mt-8 bg-white font-semibold text-brand-700" size="lg">
          Browse Artworks
        </Button>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-6 text-2xl font-bold text-ink">Featured Artworks</h2>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ArtworkCardSkeleton key={i} />)
            : featured.map((a) => <ArtworkCard key={a._id} artwork={a} />)}
        </div>
      </section>

      {/* Top Artists */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-6 text-2xl font-bold text-ink">Top Artists</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {topArtists.length === 0 && !loading && (
            <p className="text-ink/60">No sales data yet — be the first featured artist!</p>
          )}
          {topArtists.map((artist) => (
            <Card key={artist._id} className="flex flex-row items-center gap-4 p-5">
              <Avatar name={artist.artistName} color="secondary" />
              <div>
                <p className="font-semibold text-ink">{artist.artistName}</p>
                <p className="text-sm text-ink/60">{artist.sales} sales</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-6 text-2xl font-bold text-ink">Art Categories</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {CATEGORIES.map((cat) => (
            <Link key={cat} href={`/browse?category=${cat}`}>
              <Card className="flex h-24 items-center justify-center text-center font-semibold text-brand-700 transition hover:bg-brand-50">
                {cat}
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
