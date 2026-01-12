"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FINAL_PERCENT } from "@/data/quiz";

const readHumanity = () => {
  if (typeof window === "undefined") {
    return 0;
  }
  const stored = window.sessionStorage.getItem("asl_humanity");
  const value = stored ? Number.parseFloat(stored) : 0;
  return Number.isFinite(value) ? value : 0;
};

export default function KaxonUnlockLink() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const handle = () => {
      setPercent(readHumanity());
    };
    handle();
    window.addEventListener("storage", handle);
    window.addEventListener("asl:unlock", handle);
    return () => {
      window.removeEventListener("storage", handle);
      window.removeEventListener("asl:unlock", handle);
    };
  }, []);

  if (percent < FINAL_PERCENT) {
    return null;
  }

  return (
    <div className="flex justify-center pb-2">
      <Link
        href="/kaxon-rouge"
        className="inline-flex max-w-full items-center justify-center rounded-full border border-neon-cyan/60 bg-midnight/70 px-5 py-3 text-center text-[0.7rem] uppercase tracking-[0.2em] text-neon-cyan transition hover:bg-neon-cyan/10 hover:text-white sm:tracking-[0.35em]"
      >
        <span className="whitespace-normal">Acces protocole Kaxon Rouge</span>
      </Link>
    </div>
  );
}
