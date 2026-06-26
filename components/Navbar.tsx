"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@heroui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const dashboardLink = user
    ? `/dashboard/${user.role === "admin" ? "admin" : user.role === "artist" ? "artist" : "user"}`
    : "/login";

  const links = [
    { href: "/", label: "Home" },
    { href: "/browse", label: "Browse Artworks" },
    { href: dashboardLink, label: "Dashboard" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-brand-600/30 bg-ink text-paper">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="font-display text-2xl italic tracking-tight text-paper">
          Art<span className="text-brand-500">Hub</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="eyebrow text-paper/70 hover:text-brand-400">
              {l.label}
            </Link>
          ))}
          {user ? (
            <Button variant="bordered" color="secondary" size="sm" onPress={logout}>
              Logout
            </Button>
          ) : (
            <Button as={Link} href="/login" color="secondary" size="sm" className="text-ink">
              Login
            </Button>
          )}
        </div>

        <button className="text-paper md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-4 border-t border-paper/10 px-4 py-4 md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="eyebrow text-paper/80">
              {l.label}
            </Link>
          ))}
          {user ? (
            <Button variant="bordered" color="secondary" onPress={() => { logout(); setOpen(false); }}>
              Logout
            </Button>
          ) : (
            <Button as={Link} href="/login" color="secondary" className="text-ink" onPress={() => setOpen(false)}>
              Login
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
