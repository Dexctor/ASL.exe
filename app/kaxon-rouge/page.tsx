"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function KaxonRougePage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const unlocked = sessionStorage.getItem("asl_unlocked") === "true";
    if (!unlocked) {
      router.replace("/");
      return;
    }
    setAllowed(true);
  }, [router]);

  if (!allowed) {
    return (
      <main className="relative z-10">
        <section className="mx-auto max-w-3xl px-6 pb-24 text-center">
          <div className="glass-panel rounded-3xl px-6 py-10">
            <p className="text-sm uppercase tracking-[0.3em] text-neon-cyan">
              Verification d acces...
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative z-10">
      <section className="mx-auto max-w-3xl px-6 pb-24 text-center">
        <p className="text-[clamp(10px,1vw,16px)] uppercase tracking-[0.6em] text-neon-pink/80">
          Acces valide
        </p>
        <h1 className="tron-font mt-4 text-[clamp(1.8rem,4.2vw,3.8rem)] font-semibold text-white">
          Kaxon Rouge - Acces valide
        </h1>
        <div className="mt-8 glass-panel rounded-3xl px-6 py-10 text-left text-[clamp(0.95rem,1.3vw,1.2rem)] text-slate-200 normal-case">
          <p className="text-[clamp(1.1rem,1.8vw,1.6rem)] font-semibold text-white">
            Bravo. Mission accomplie.
          </p>
          <p className="mt-4">
            Grace a vos choix et a votre perseverance, le systeme est stabilise
            : <strong>l IA est reparee</strong>.
          </p>
          <p className="mt-4">Vous pouvez etre fiers de vous.</p>
        </div>
        <Link
          href="/"
          className="mt-8 inline-flex text-[clamp(0.7rem,0.9vw,0.9rem)] uppercase tracking-[0.3em] text-neon-cyan hover:text-white"
        >
          Retour a l accueil
        </Link>
      </section>
    </main>
  );
}
