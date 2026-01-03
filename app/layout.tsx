import type { Metadata } from "next";
import Link from "next/link";
import AudioController from "@/components/AudioController";
import "./globals.css";

export const metadata: Metadata = {
  title: "ASL.EXE",
  description: "Experience neon futuriste - Kaxon Rouge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased text-slate-100">
        <div className="relative min-h-screen overflow-x-hidden">
          <div
            className="pointer-events-none fixed inset-0 bg-aurora"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none fixed inset-0 bg-grid"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none fixed inset-0 scanlines"
            aria-hidden="true"
          />
          <AudioController />
          <div className="relative z-10">
            <header className="flex items-center justify-between px-6 py-6 sm:px-10">
              <Link
                href="/"
                className="tron-font text-sm font-semibold tracking-[0.6em] text-neon-cyan/90 transition hover:text-neon-cyan"
              >
                ASL.EXE
              </Link>
              <div className="hidden text-xs uppercase tracking-[0.4em] text-slate-400 sm:block">
                Protocole Kaxon Rouge
              </div>
            </header>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
