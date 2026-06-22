import Link from "next/link";
import Image from "next/image";
import { Card, CardBody, Chip } from "@heroui/react";
import { Artwork } from "../lib/types";

export default function ArtworkCard({ artwork }: { artwork: Artwork }) {
  return (
    <Link href={`/artworks/${artwork._id}`} className="block">
      <Card className="group overflow-hidden transition hover:-translate-y-1 hover:shadow-lg" shadow="sm">
        <div className="relative h-48 w-full bg-brand-50">
          <Image src={artwork.image} alt={artwork.title} fill className="object-cover" unoptimized />
          {artwork.sold && (
            <Chip color="default" className="absolute right-2 top-2 bg-ink text-white" size="sm">
              Sold
            </Chip>
          )}
        </div>
        <CardBody className="p-4">
          <h3 className="truncate font-semibold text-ink">{artwork.title}</h3>
          <p className="mt-1 text-sm text-ink/60">by {artwork.artistName}</p>
          <p className="mt-2 font-bold text-brand-700">${artwork.price}</p>
        </CardBody>
      </Card>
    </Link>
  );
}
