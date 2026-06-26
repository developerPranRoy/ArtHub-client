import "./globals.css";
import { ReactNode } from "react";
import { Fraunces, Inter } from "next/font/google";
import { Providers } from "./providers";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "ArtHub — Discover & Buy Original Art",
  description: "An online marketplace connecting art lovers with talented independent artists.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col bg-paper font-sans text-ink">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
