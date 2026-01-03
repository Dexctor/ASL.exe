"use client";

import { useEffect, useRef, useState } from "react";

export default function AudioController() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [needsInteraction, setNeedsInteraction] = useState(false);

  const tryPlay = async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    audio.volume = 0.3;
    try {
      await audio.play();
      localStorage.setItem("asl_audio_on", "1");
      setNeedsInteraction(false);
    } catch {
      setNeedsInteraction(true);
    }
  };

  useEffect(() => {
    void tryPlay();
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/never-gonna-give-you-up.mp3"
        preload="auto"
        loop
        playsInline
      />
      {needsInteraction ? (
        <div className="fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 rounded-2xl border border-neon-pink/40 bg-midnight/90 px-4 py-3 text-center shadow-[0_0_18px_rgba(255,94,219,0.25)] backdrop-blur sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-24 sm:max-w-xs">
          <p className="text-[clamp(0.7rem,0.9vw,0.95rem)] text-slate-200 normal-case">
            Autoplay bloque. Active le son pour lancer le protocole audio.
          </p>
          <button
            type="button"
            onClick={tryPlay}
            className="rounded-xl border border-neon-pink/70 px-4 py-2 text-[clamp(0.65rem,0.8vw,0.85rem)] uppercase tracking-[0.3em] text-neon-pink transition hover:bg-neon-pink/20"
          >
            Activer le son
          </button>
        </div>
      ) : null}
    </>
  );
}

