"use client";

import Link from "next/link";
import { Input, Button } from "@heroui/react";
import { ShareIcon, CameraIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-black/5 bg-ink text-cream/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <h3 className="mb-2 text-lg font-bold text-white">ArtHub</h3>
          <p className="text-sm">Discover and collect original art from independent artists worldwide.</p>
        </div>

        <div>
          <h4 className="mb-2 font-semibold text-white">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-2 font-semibold text-white">Stay in the loop</h4>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <Input type="email" placeholder="Your email" size="sm" className="bg-white rounded-lg" />
            <Button color="secondary" size="sm" type="submit">Join</Button>
          </form>
          <div className="mt-4 flex gap-4">
            <a href="#" aria-label="Facebook"><ShareIcon className="h-5 w-5" /></a>
            <a href="#" aria-label="Instagram"><CameraIcon className="h-5 w-5" /></a>
            <a href="#" aria-label="Twitter"><ChatBubbleLeftRightIcon className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs">
        © {new Date().getFullYear()} ArtHub. All rights reserved.
      </p>
    </footer>
  );
}
