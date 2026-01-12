"use client";

import {
  AnimatePresence,
  cubicBezier,
  motion,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const mediaItems = [
  { src: "/img/IMG_2079.MOV", type: "video", label: "IMG 2079" },
  { src: "/img/IMG_2082.JPG", type: "image", label: "IMG 2082" },
  { src: "/img/IMG_2101.JPG", type: "image", label: "IMG 2101" },
  { src: "/img/IMG_2114.JPG", type: "image", label: "IMG 2114" },
  { src: "/img/IMG_2184.JPG", type: "image", label: "IMG 2184" },
  { src: "/img/IMG_2190.JPG", type: "image", label: "IMG 2190" },
  { src: "/img/IMG_2192.JPG", type: "image", label: "IMG 2192" },
  { src: "/img/IMG_2195.JPG", type: "image", label: "IMG 2195" },
  { src: "/img/IMG_2202.JPG", type: "image", label: "IMG 2202" },
  { src: "/img/IMG_2207.JPG", type: "image", label: "IMG 2207" },
  { src: "/img/IMG_2209.JPG", type: "image", label: "IMG 2209" },
  { src: "/img/IMG_2217.JPG", type: "image", label: "IMG 2217" },
  { src: "/img/IMG_2221.MOV", type: "video", label: "IMG 2221" },
  { src: "/img/IMG_2297.jpeg", type: "image", label: "IMG 2297" },
  { src: "/img/IMG_2298.mov", type: "video", label: "IMG 2298" },
  { src: "/img/IMG_2302.mov", type: "video", label: "IMG 2302" },
  { src: "/img/IMG_2303.jpeg", type: "image", label: "IMG 2303" },
  { src: "/img/photo site ASL.png", type: "image", label: "Photo site ASL" },
];
const totalItems = mediaItems.length;

export default function BestTeamPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();
  const easeOut = cubicBezier(0.16, 1, 0.3, 1);
  const activeItem = mediaItems[activeIndex];
  const slideVariants = {
    enter: (slideDirection: number) => ({
      opacity: 0,
      x: reduceMotion ? 0 : slideDirection * 60,
      scale: reduceMotion ? 1 : 0.98,
    }),
    center: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: reduceMotion ? 0 : 0.45,
        ease: easeOut,
      },
    },
    exit: (slideDirection: number) => ({
      opacity: 0,
      x: reduceMotion ? 0 : slideDirection * -60,
      scale: reduceMotion ? 1 : 0.98,
      transition: {
        duration: reduceMotion ? 0 : 0.3,
        ease: easeOut,
      },
    }),
  };

  const handlePrevious = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % totalItems);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setDirection(-1);
        setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
      }
      if (event.key === "ArrowRight") {
        setDirection(1);
        setActiveIndex((prev) => (prev + 1) % totalItems);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
              Les coulisses
            </h1>
          </div>

          <div className="relative mt-8">
            <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/60 to-transparent" />
           <div className="relative mt-6">
              <div className="relative mx-auto flex w-full max-w-5xl items-center justify-center">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="group absolute left-0 z-10 flex h-10 w-10 -translate-x-3 items-center justify-center rounded-full border border-neon-cyan/50 bg-midnight/80 text-[1.1rem] text-neon-cyan transition hover:border-neon-cyan hover:text-white sm:h-12 sm:w-12 sm:-translate-x-5"
                  aria-label="Media precedente"
                >
                  {"<"}
                </button>
                <div className="w-full px-10 sm:px-16">
                  <div className="relative overflow-hidden rounded-[28px] border border-neon-cyan/30 bg-midnight/80">
                    <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
                      <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                          key={activeItem.src}
                          custom={direction}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          className="absolute inset-0"
                        >
                          {activeItem.type === "image" ? (
                            <Image
                              src={activeItem.src}
                              alt={activeItem.label}
                              width={1400}
                              height={1000}
                              className="h-full w-full object-cover"
                              priority
                            />
                          ) : (
                            <video
                              key={activeItem.src}
                              className="h-full w-full object-cover"
                              controls
                              playsInline
                              preload="metadata"
                              src={activeItem.src}
                            />
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[clamp(0.65rem,0.9vw,0.9rem)] uppercase tracking-[0.35em] text-neon-cyan/70">
                    <span>{activeItem.label}</span>
                    <span>
                      {String(activeIndex + 1).padStart(2, "0")} /{" "}
                      {String(totalItems).padStart(2, "0")}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleNext}
                  className="group absolute right-0 z-10 flex h-10 w-10 translate-x-3 items-center justify-center rounded-full border border-neon-cyan/50 bg-midnight/80 text-[1.1rem] text-neon-cyan transition hover:border-neon-cyan hover:text-white sm:h-12 sm:w-12 sm:translate-x-5"
                  aria-label="Media suivante"
                >
                  {">"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
