import GameEngine from "@/components/GameEngine";
import KaxonUnlockLink from "@/components/KaxonUnlockLink";

export default function DernierRempartPage() {
  return (
    <main className="relative z-10">
      <section className="mx-auto flex min-h-[calc(100svh-88px)] w-full max-w-screen-2xl flex-col gap-6 px-4 pb-4 pt-4 sm:min-h-[calc(100vh-120px)] sm:px-6 sm:pb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-neon-cyan/25 bg-midnight/50 px-4 py-3 text-neon-cyan/80 shadow-[0_0_18px_rgba(45,250,255,0.18)]">
          <div className="flex flex-col gap-1">
            <span className="text-[clamp(0.45rem,0.65vw,0.7rem)] uppercase tracking-[0.35em] text-neon-cyan/60">
              Simulation d&apos;empathie
            </span>
            <span className="text-[clamp(0.85rem,1.1vw,1.05rem)] font-semibold text-white normal-case">
              Protocole Dernier Rempart
            </span>
          </div>
          <div className="flex items-center gap-2 text-[clamp(0.55rem,0.75vw,0.75rem)] uppercase tracking-[0.2em] text-neon-cyan/70 sm:tracking-[0.3em]">
            <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan shadow-[0_0_8px_rgba(45,250,255,0.8)]" />
            <span>Systeme en ligne</span>
          </div>
        </div>
        <div className="relative flex-1 overflow-hidden rounded-[36px] border border-neon-cyan/35 bg-midnight/60 p-4 shadow-neon sm:p-6">
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <div className="absolute left-6 top-6 h-12 w-12 border-l-2 border-t-2 border-neon-cyan/40" />
            <div className="absolute right-6 bottom-6 h-12 w-12 border-b-2 border-r-2 border-neon-cyan/40" />
          </div>
          <div className="relative h-full">
            <GameEngine />
          </div>
        </div>
        <KaxonUnlockLink />
      </section>
    </main>
  );
}
