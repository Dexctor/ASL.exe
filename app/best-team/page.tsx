"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const teamPhotos = [
  { src: "/team/1.jpg", label: "Équipe 01" },
  { src: "/team/2.jpg", label: "Équipe 02" },
  { src: "/team/3.jpg", label: "Équipe 03" },
  { src: "/team/4.jpg", label: "Équipe 04" },
  { src: "/team/5.jpg", label: "Équipe 05" },
  { src: "/team/6.jpg", label: "Équipe 06" },
];

export default function BestTeamPage() {
  const [active, setActive] = useState<(typeof teamPhotos)[number] | null>(
    null
  );
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!active) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(null);
      }
      if (event.key === "Tab") {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active]);

  return (
    <main className="relative z-10">
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <p className="text-[clamp(10px,1vw,16px)] uppercase tracking-[0.6em] text-neon-lime/80">
          Galerie
        </p>
        <h1 className="tron-font mt-4 text-[clamp(1.8rem,4.2vw,3.8rem)] font-semibold text-white">
          La Best Team
        </h1>
        <p className="mt-4 max-w-2xl text-[clamp(0.95rem,1.3vw,1.2rem)] text-slate-200 normal-case">
          Une équipe qui brille ensemble. Clique sur une photo pour l'ouvrir en
          grand.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {teamPhotos.map((photo) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setActive(photo)}
              className="group relative overflow-hidden rounded-2xl border border-neon-cyan/30 bg-midnight/70 transition hover:border-neon-cyan/70 hover:shadow-neon"
            >
              <Image
                src={photo.src}
                alt={photo.label}
                width={600}
                height={600}
                className="h-44 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-56"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              <span className="absolute bottom-3 left-3 text-[clamp(0.6rem,0.8vw,0.85rem)] uppercase tracking-[0.3em] text-neon-cyan">
                {photo.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {active ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6 py-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="team-modal-title"
          onClick={() => setActive(null)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-neon-cyan/50 bg-midnight/90 shadow-neon"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="team-modal-title" className="sr-only">
              {active.label}
            </h2>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setActive(null)}
              className="absolute right-4 top-4 rounded-full border border-neon-cyan/60 px-3 py-2 text-[clamp(0.6rem,0.8vw,0.9rem)] uppercase tracking-[0.3em] text-neon-cyan hover:bg-neon-cyan/20"
              aria-label="Fermer la photo"
            >
              Fermer
            </button>
            <Image
              src={active.src}
              alt={active.label}
              width={1200}
              height={900}
              className="h-[70vh] w-full object-cover"
            />
            <div className="px-6 py-4 text-[clamp(0.85rem,1.2vw,1.1rem)] text-slate-200 normal-case">
              {active.label}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
