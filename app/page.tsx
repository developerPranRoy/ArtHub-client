"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
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
      {/* Hero — an exhibition opener, not a SaaS banner */}
      <section className="relative overflow-hidden bg-ink px-4 py-28 text-center text-paper">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,162,39,0.25), transparent 70%)",
          }}
        />
        <p className="eyebrow relative text-brand-400">Now Showing — Open Call</p>
        <h1 className="relative mx-auto mt-4 max-w-2xl font-display text-5xl italic leading-[1.15] md:text-6xl">
          Original art, straight from the studio.
        </h1>
        <p className="relative mx-auto mt-5 max-w-md text-sm text-paper/60">
          ArtHub connects you directly with independent artists — no gallery markup,
          no middlemen, just the work.
        </p>
        <Button
          as={Link}
          href="/browse"
          className="relative mt-9 rounded-md bg-brand-500 px-7 font-semibold text-ink hover:bg-brand-400"
          size="lg"
        >
          Browse Artworks
        </Button>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="eyebrow text-ink/40">Current Exhibition</p>
        <h2 className="mt-1 font-display text-3xl italic text-ink">Featured Artworks</h2>
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ArtworkCardSkeleton key={i} />)
            : featured.map((a) => <ArtworkCard key={a._id} artwork={a} />)}
        </div>
      </section>

      {/* Top Artists */}
      <section className="mx-auto max-w-6xl border-t border-ink/10 px-4 py-20">
        <p className="eyebrow text-ink/40">In the Spotlight</p>
        <h2 className="mt-1 font-display text-3xl italic text-ink">Top Artists</h2>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {topArtists.length === 0 && !loading && (
            <p className="text-sm text-ink/50">No sales data yet — be the first featured artist!</p>
          )}
          {topArtists.map((artist, i) => (
            <div key={artist._id} className="frame flex items-center gap-4 bg-white p-5">
              <span className="font-display text-2xl italic text-brand-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-medium text-ink">{artist.artistName}</p>
                <p className="eyebrow mt-0.5 text-ink/40">{artist.sales} sales</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl border-t border-ink/10 px-4 py-20">
        <p className="eyebrow text-ink/40">Browse by Medium</p>
        <h2 className="mt-1 font-display text-3xl italic text-ink">Art Categories</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/browse?category=${cat}`}
              className="frame flex h-24 items-center justify-center bg-white text-center text-sm font-medium text-ink transition hover:border-brand-500/60 hover:text-brand-700"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
