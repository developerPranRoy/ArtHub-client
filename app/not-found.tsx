"use client";

import Link from "next/link";
import { Button } from "@heroui/react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-ink">Page Not Found</h1>
      <p className="mt-2 text-ink/60">The page you&apos;re looking for doesn&apos;t exist or was moved.</p>
      <Button as={Link} href="/" color="secondary" className="mt-6">Go Home</Button>
    </div>
  );
}
