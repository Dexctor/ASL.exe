"use client";

import { cubicBezier, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const teamPhotos = [
  { src: "/team/1.jpg", label: "Equipe 01" },
  { src: "/team/2.jpg", label: "Equipe 02" },
  { src: "/team/3.jpg", label: "Equipe 03" },
  { src: "/team/4.jpg", label: "Equipe 04" },
  { src: "/team/5.jpg", label: "Equipe 05" },
  { src: "/team/6.jpg", label: "Equipe 06" },
];

export default function BestTeamPage() {
  const [active, setActive] = useState<(typeof teamPhotos)[number] | null>(
    null
  );
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const reduceMotion = useReducedMotion();
  const easeOut = cubicBezier(0.16, 1, 0.3, 1);
  const gridVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: reduceMotion ? 0 : 0.25,
        ease: easeOut,
        staggerChildren: reduceMotion ? 0 : 0.08,
        delayChildren: reduceMotion ? 0 : 0.05,
      },
    },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.45,
        ease: easeOut,
      },
    },
  };

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
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-6 sm:pt-10">
        <div className="relative overflow-hidden rounded-[36px] border border-neon-cyan/25 bg-midnight/70 px-6 py-8 shadow-[0_0_40px_rgba(45,250,255,0.16)] sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(45,250,255,0.14),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(45,250,255,0.06),transparent_40%,rgba(255,94,219,0.08))]" />
          <div className="pointer-events-none absolute right-6 top-6 h-12 w-12 border-r-2 border-t-2 border-neon-cyan/30" />
          <div className="pointer-events-none absolute bottom-6 left-6 h-12 w-12 border-b-2 border-l-2 border-neon-cyan/30" />

          <div className="relative">
            <p className="text-[clamp(10px,1vw,16px)] uppercase tracking-[0.35em] text-neon-lime/80 sm:tracking-[0.6em]">
              Galerie
            </p>
            <h1 className="tron-font mt-4 text-[clamp(2rem,4.4vw,4rem)] font-semibold text-white">
              La Best Team
            </h1>
            <p className="mt-3 max-w-2xl text-[clamp(0.95rem,1.4vw,1.3rem)] text-slate-200 normal-case">
              Une equipe qui brille ensemble. Clique sur une photo pour
              l&apos;ouvrir en grand.
            </p>
          </div>

          <div className="relative mt-6 flex flex-wrap gap-3 text-[0.7rem] uppercase tracking-[0.25em] text-neon-cyan/70 sm:tracking-[0.4em]">
            <div className="rounded-full border border-neon-cyan/30 bg-slate-950/70 px-4 py-2">
              Equipe active
            </div>
            <div className="rounded-full border border-neon-cyan/30 bg-slate-950/70 px-4 py-2">
              6 portraits
            </div>
            <div className="rounded-full border border-neon-cyan/30 bg-slate-950/70 px-4 py-2">
              Statut: en mission
            </div>
          </div>

          <div className="relative mt-8">
            <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/60 to-transparent" />
            <div className="pointer-events-none absolute left-0 right-0 top-0 h-8 bg-gradient-to-b from-neon-cyan/10 to-transparent" />
            <motion.div
              className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
              variants={gridVariants}
              initial="hidden"
              animate="show"
            >
              {teamPhotos.map((photo) => (
                <motion.button
                  key={photo.src}
                  type="button"
                  onClick={() => setActive(photo)}
                  className="group relative overflow-hidden rounded-2xl border border-neon-cyan/30 bg-midnight/70 transition hover:border-neon-cyan/70 hover:shadow-neon"
                  variants={cardVariants}
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(45,250,255,0.18),transparent)]" />
                  </div>
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
                </motion.button>
              ))}
            </motion.div>
          </div>
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
              className="h-[60svh] w-full object-cover sm:h-[70vh]"
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
