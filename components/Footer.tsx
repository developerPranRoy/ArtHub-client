"use client";

import Link from "next/link";
import { Input, Button } from "@heroui/react";
import { ShareIcon, CameraIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-brand-600/30 bg-ink text-paper/75">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <h3 className="font-display text-xl italic text-paper">ArtHub</h3>
          <p className="mt-2 text-sm leading-relaxed">
            Discover and collect original art from independent artists worldwide.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-3 text-paper/50">Quick Links</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-brand-400">About</Link></li>
            <li><Link href="/contact" className="hover:text-brand-400">Contact</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-brand-400">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-3 text-paper/50">Stay in the Loop</p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <Input type="email" placeholder="Your email" size="sm" className="rounded-md bg-paper" />
            <Button color="secondary" size="sm" type="submit" className="text-ink">Join</Button>
          </form>
          <div className="mt-5 flex gap-5 text-paper/50">
            <a href="#" aria-label="Facebook" className="hover:text-brand-400"><ShareIcon className="h-5 w-5" /></a>
            <a href="#" aria-label="Instagram" className="hover:text-brand-400"><CameraIcon className="h-5 w-5" /></a>
            <a href="#" aria-label="Twitter" className="hover:text-brand-400"><ChatBubbleLeftRightIcon className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
      <p className="border-t border-paper/10 py-4 text-center text-xs text-paper/40">
        © {new Date().getFullYear()} ArtHub. All rights reserved.
      </p>
    </footer>
  );
}
