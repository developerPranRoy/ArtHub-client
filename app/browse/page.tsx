"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@heroui/react";
import api from "../../lib/api";
import ArtworkCard from "../../components/ArtworkCard";
import { ArtworkCardSkeleton } from "../../components/Loaders";
import Pagination from "../../components/Pagination";
import { Artwork, BrowseResult } from "../../lib/types";

const CATEGORIES = ["all", "Painting", "Digital", "Sculpture", "Photography", "Illustration"];

function BrowseContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    search: "",
    category: searchParams.get("category") || "all",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
    page: 1,
  });
  const [data, setData] = useState<BrowseResult>({ items: [], total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/artworks/browse", { params: { ...filters, limit: 8 } })
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filters]);

  function update(key: string, value: string | number) {
    setFilters((f) => ({ ...f, [key]: value, page: key === "page" ? (value as number) : 1 }));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-ink">Browse Artworks</h1>

      {/* Filters - HeroUI Input for text/number fields (reliable component),
          native select for dropdowns since HeroUI Select has known compatibility quirks */}
      <div className="card mb-8 grid grid-cols-1 gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-sm md:grid-cols-5">
        <Input
          placeholder="Search title or artist"
          className="md:col-span-2"
          value={filters.search}
          onValueChange={(v) => update("search", v)}
        />
        <select className="input" value={filters.category} onChange={(e) => update("category", e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <Input type="number" placeholder="Min $" value={filters.minPrice} onValueChange={(v) => update("minPrice", v)} />
          <Input type="number" placeholder="Max $" value={filters.maxPrice} onValueChange={(v) => update("maxPrice", v)} />
        </div>
        <select className="input" value={filters.sort} onChange={(e) => update("sort", e.target.value)}>
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <ArtworkCardSkeleton key={i} />)
        ) : data.items.length === 0 ? (
          <p className="col-span-full py-10 text-center text-ink/60">
            No artworks match your filters. Try adjusting your search.
          </p>
        ) : (
          data.items.map((a: Artwork) => <ArtworkCard key={a._id} artwork={a} />)
        )}
      </div>

      <Pagination page={filters.page} totalPages={data.totalPages} onChange={(p) => update("page", p)} />
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={null}>
      <BrowseContent />
    </Suspense>
  );
}
