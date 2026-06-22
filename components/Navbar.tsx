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
    <header className="sticky top-0 z-50 border-b border-black/5 bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-brand-700">
          Art<span className="text-ink">Hub</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-ink/80 hover:text-brand-700">
              {l.label}
            </Link>
          ))}
          {user ? (
            <Button variant="bordered" color="secondary" size="sm" onPress={logout}>
              Logout
            </Button>
          ) : (
            <Button as={Link} href="/login" color="secondary" size="sm">
              Login
            </Button>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-3 border-t border-black/5 px-4 py-4 md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm font-medium text-ink/80">
              {l.label}
            </Link>
          ))}
          {user ? (
            <Button variant="bordered" color="secondary" onPress={() => { logout(); setOpen(false); }}>
              Logout
            </Button>
          ) : (
            <Button as={Link} href="/login" color="secondary" onPress={() => setOpen(false)}>
              Login
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
