"use client";

import type { Variants } from "framer-motion";
import { cubicBezier, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FINAL_PERCENT } from "@/data/quiz";

const STATUS_SEQUENCE = [
  {
    key: "loading",
    label: "Chargement",
    durationMs: 700,
    dotClass: "bg-neon-cyan",
    textClass: "text-neon-cyan/80",
    borderClass: "border-neon-cyan/40",
  },
  {
    key: "checking",
    label: "Verification",
    durationMs: 900,
    dotClass: "bg-neon-cyan",
    textClass: "text-neon-cyan/80",
    borderClass: "border-neon-cyan/40",
  },
  {
    key: "accepted",
    label: "ACCEPTED",
    durationMs: 700,
    dotClass: "bg-neon-lime",
    textClass: "text-neon-lime",
    borderClass: "border-neon-lime/40",
  },
] as const;

const REVEAL_DELAY_MS = 250;
const STAGGER_MS = 0.12;

export default function KaxonRougePage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [isDebug, setIsDebug] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("asl_humanity");
    const percent = stored ? Number.parseFloat(stored) : 0;
    if (!Number.isFinite(percent) || percent < FINAL_PERCENT) {
      router.replace("/");
      return;
    }
    const timerId = window.setTimeout(() => {
      setAllowed(true);
    }, 0);
    return () => window.clearTimeout(timerId);
  }, [router]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const timerId = window.setTimeout(() => {
      setIsDebug(new URLSearchParams(window.location.search).has("debug"));
    }, 0);
    return () => window.clearTimeout(timerId);
  }, []);

  useEffect(() => {
    if (!allowed) {
      return;
    }
    let active = true;
    const timers: number[] = [];
    timers.push(
      window.setTimeout(() => {
        if (active) {
          setStatusIndex(0);
          setShowContent(false);
        }
      }, 0)
    );

    let elapsed = 0;
    for (let i = 1; i < STATUS_SEQUENCE.length; i += 1) {
      elapsed += isDebug ? 0 : STATUS_SEQUENCE[i - 1].durationMs;
      timers.push(
        window.setTimeout(() => {
          if (active) {
            setStatusIndex(i);
          }
        }, elapsed)
      );
    }

    elapsed += isDebug ? 0 : STATUS_SEQUENCE[STATUS_SEQUENCE.length - 1].durationMs;
    timers.push(
      window.setTimeout(() => {
        if (active) {
          setShowContent(true);
        }
      }, elapsed + (isDebug ? 0 : REVEAL_DELAY_MS))
    );

    return () => {
      active = false;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [allowed, isDebug]);

  const status = STATUS_SEQUENCE[Math.min(statusIndex, STATUS_SEQUENCE.length - 1)];
  const easeOut = cubicBezier(0.16, 1, 0.3, 1);
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: isDebug ? 0 : 0.3,
        ease: easeOut,
        staggerChildren: isDebug ? 0 : STAGGER_MS,
        delayChildren: isDebug ? 0 : 0.1,
      },
    },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isDebug ? 0 : 0.45,
        ease: easeOut,
      },
    },
  };

  if (!allowed) {
    return (
      <main className="relative z-10">
        <section className="mx-auto max-w-3xl px-6 pb-24 text-center">
          <div className="glass-panel rounded-3xl px-6 py-10">
            <p className="text-sm uppercase tracking-[0.3em] text-neon-cyan">
              Verification d&apos;acces...
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative z-10">
      <section className="mx-auto flex min-h-[calc(100svh-88px)] max-w-5xl flex-col gap-6 px-6 pb-24 pt-8 text-center sm:pt-12">
        <motion.div
          key={status.key}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: isDebug ? 0 : 0.4, ease: easeOut }}
          className={`mx-auto flex items-center gap-3 rounded-full border px-4 py-2 text-[clamp(0.55rem,0.85vw,0.8rem)] uppercase tracking-[0.25em] ${status.borderClass} bg-midnight/80 shadow-[0_0_16px_rgba(45,250,255,0.2)] sm:tracking-[0.5em]`}
        >
          <span
            className={`h-2 w-2 rounded-full ${status.dotClass} shadow-[0_0_10px_rgba(45,250,255,0.7)]`}
          />
          <span className={status.textClass}>{status.label}</span>
          {status.key === "accepted" ? (
            <svg
              className="h-4 w-4 text-neon-lime"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border border-neon-cyan/70 border-t-transparent" />
          )}
        </motion.div>
        <div className="relative overflow-hidden rounded-[36px] border border-neon-cyan/30 bg-midnight/70 p-6 text-left shadow-[0_0_40px_rgba(45,250,255,0.2)] sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(45,250,255,0.18),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(45,250,255,0.08),transparent_40%,rgba(255,94,219,0.08))]" />
          <div className="pointer-events-none absolute right-6 top-6 h-12 w-12 border-r-2 border-t-2 border-neon-cyan/30" />
          <div className="pointer-events-none absolute bottom-6 left-6 h-12 w-12 border-b-2 border-l-2 border-neon-cyan/30" />
          <motion.div
            className="relative flex flex-col gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={showContent ? "show" : "hidden"}
          >
            <motion.div className="flex flex-wrap items-center gap-4" variants={itemVariants}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-neon-cyan/30 bg-neon-cyan/10">
                <svg
                  className="h-6 w-6 text-neon-cyan"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <div>
              <p className="text-[clamp(0.6rem,0.9vw,0.8rem)] uppercase tracking-[0.25em] text-neon-cyan/70 sm:tracking-[0.4em]">
                Transmission reussie
              </p>
                <h1 className="tron-font text-[clamp(1.8rem,3.6vw,3.5rem)] font-semibold text-white">
                  Bravo. Mission accomplie.
                </h1>
              </div>
            </motion.div>
            <motion.div
              className="max-w-2xl text-[clamp(0.95rem,1.4vw,1.2rem)] text-slate-200 normal-case"
              variants={itemVariants}
            >
              <p>
                Bravo, vous avez reussi ! Grace a vos efforts, l&apos;IA est
                maintenant reparee. Vous pouvez etre fiers de vous.
              </p>
            </motion.div>
            <motion.div className="grid gap-4 sm:grid-cols-3" variants={itemVariants}>
              <div className="rounded-2xl border border-neon-cyan/25 bg-slate-950/70 px-4 py-4 shadow-[0_0_16px_rgba(45,250,255,0.15)]">
                <div className="flex items-center gap-3">
                  <svg
                    className="h-5 w-5 text-neon-cyan"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 2 4 5v6c0 5 8 11 8 11s8-6 8-11V5l-8-3z" />
                  </svg>
                  <span className="text-[0.7rem] uppercase tracking-[0.3em] text-neon-cyan/70">
                    Securite
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-200">Acces valide</p>
              </div>
              <div className="rounded-2xl border border-neon-cyan/25 bg-slate-950/70 px-4 py-4 shadow-[0_0_16px_rgba(45,250,255,0.15)]">
                <div className="flex items-center gap-3">
                  <svg
                    className="h-5 w-5 text-neon-cyan"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <path d="M9 9h6v6H9z" />
                  </svg>
                  <span className="text-[0.7rem] uppercase tracking-[0.3em] text-neon-cyan/70">
                    Systeme
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-200">Stabilise</p>
              </div>
              <div className="rounded-2xl border border-neon-cyan/25 bg-slate-950/70 px-4 py-4 shadow-[0_0_16px_rgba(45,250,255,0.15)]">
                <div className="flex items-center gap-3">
                  <svg
                    className="h-5 w-5 text-neon-cyan"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M7 4h10v4H7z" />
                    <path d="M5 8h14v12H5z" />
                    <path d="M9 12h6" />
                  </svg>
                  <span className="text-[0.7rem] uppercase tracking-[0.3em] text-neon-cyan/70">
                    IA
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-200">Reparee</p>
              </div>
            </motion.div>
            <motion.div
              className="flex flex-wrap items-center justify-between gap-4 border-t border-neon-cyan/20 pt-4 text-[0.7rem] uppercase tracking-[0.25em] text-neon-cyan/60 sm:tracking-[0.4em]"
              variants={itemVariants}
            >
              <span>Protocole Kaxon Rouge</span>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-neon-cyan transition hover:text-white"
              >
                Retour a l&apos;accueil
                <span className="h-px w-6 bg-neon-cyan/70" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
