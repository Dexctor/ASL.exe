"use client";

import { useEffect, useState } from "react";

const VIDEO_SRC =
  "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&playsinline=1&list=RDdQw4w9WgXcQ&start_radio=1";

export default function IntroVideoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Video d'introduction"
    >
      <div className="w-[min(94vw,1080px)] overflow-hidden rounded-3xl border border-neon-cyan/30 bg-midnight/90 shadow-[0_0_40px_rgba(45,250,255,0.25)]">
        <div className="aspect-video w-full">
          <iframe
            className="h-full w-full"
            src={VIDEO_SRC}
            title="Video d'introduction"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="flex justify-end px-4 py-3">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-full border border-neon-cyan/60 bg-midnight/80 px-4 py-2 text-[0.65rem] uppercase tracking-[0.3em] text-neon-cyan shadow-[0_0_12px_rgba(45,250,255,0.3)] transition hover:bg-neon-cyan/10 hover:text-white"
          >
            Quitter
          </button>
        </div>
      </div>
    </div>
  );
}
