import Link from "next/link";
import Image from "next/image";
import { Artwork } from "../lib/types";

export default function ArtworkCard({ artwork }: { artwork: Artwork }) {
  return (
    <Link href={`/artworks/${artwork._id}`} className="group block">
      <div className="frame overflow-hidden bg-white transition group-hover:border-brand-500/60">
        <div className="relative h-48 w-full overflow-hidden bg-brand-50">
          <Image
            src={artwork.image}
            alt={artwork.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            unoptimized
          />
          {artwork.sold && (
            <span className="absolute right-2 top-2 bg-ink px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-paper">
              Sold
            </span>
          )}
        </div>
      </div>

      {/* Museum label strip */}
      <div className="border-t-0 px-1 py-3">
        <p className="eyebrow text-ink/50">{artwork.category}</p>
        <h3 className="mt-1 truncate font-display text-lg italic text-ink">{artwork.title}</h3>
        <div className="mt-1.5 flex items-center justify-between">
          <p className="text-xs text-ink/60">by {artwork.artistName}</p>
          <p className="font-display text-sm font-medium text-brand-700">${artwork.price}</p>
        </div>
      </div>
    </Link>
  );
}
