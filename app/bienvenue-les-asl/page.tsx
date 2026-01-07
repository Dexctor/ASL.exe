export default function BienvenueLesAslPage() {
  return (
    <main className="relative z-10">
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-6 sm:pt-10">
        <div className="relative overflow-hidden rounded-[36px] border border-neon-cyan/25 bg-midnight/70 px-6 py-8 shadow-[0_0_40px_rgba(45,250,255,0.16)] sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(45,250,255,0.16),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(45,250,255,0.08),transparent_40%,rgba(255,94,219,0.08))]" />
          <div className="pointer-events-none absolute right-6 top-6 h-12 w-12 border-r-2 border-t-2 border-neon-cyan/30" />
          <div className="pointer-events-none absolute bottom-6 left-6 h-12 w-12 border-b-2 border-l-2 border-neon-cyan/30" />

          <div className="relative">
            <p className="text-[clamp(10px,1vw,16px)] uppercase tracking-[0.35em] text-neon-cyan/80 sm:tracking-[0.6em]">
              Message officiel
            </p>
            <h1 className="tron-font mt-4 text-[clamp(2rem,4.4vw,4rem)] font-semibold text-white">
              Bienvenue les ASL
            </h1>
            <p className="mt-3 max-w-2xl text-[clamp(0.95rem,1.4vw,1.3rem)] text-slate-200 normal-case">
              Kaxon Rouge ouvre ses portes. Voici le briefing de depart pour
              rentrer dans la mission.
            </p>
          </div>

          <div className="relative mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="glass-panel rounded-3xl px-6 py-6 sm:px-8">
              <div className="space-y-5 text-[clamp(0.95rem,1.3vw,1.2rem)] leading-relaxed text-slate-200 normal-case">
                <p>
                  Chers ASL, bienvenue a <strong>Kaxon Rouge</strong>. Vous etes
                  ici dans l&apos;une des meilleures ecoles pour devenir de
                  veritables professionnels du son et de la lumiere.
                </p>
                <p>
                  Meme si vous venez tout juste d&apos;arriver, sachez que vous
                  faites deja pleinement partie de la{" "}
                  <strong>Homair Family</strong>.
                </p>
                <p>
                  Votre parcours sera rythme par de nombreux moments, parfois
                  intenses, parfois memorables, mais chacun d&apos;eux vous fera
                  grandir et vous aidera a devenir la meilleure version de vous-memes.
                </p>
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-neon-cyan/70 to-transparent" />
                <p>
                  Un seul mot d&apos;ordre pour vous accompagner tout au long de
                  cette aventure :{" "}
                  <strong>travailler en s&apos;amusant, tout en restant serieux</strong>.
                </p>
                <p>
                  Nous vous souhaitons une excellente formation et beaucoup de
                  reussite.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="rounded-3xl border border-neon-cyan/30 bg-slate-950/70 px-6 py-6 shadow-[0_0_20px_rgba(45,250,255,0.18)]">
                <p className="text-[0.7rem] uppercase tracking-[0.25em] text-neon-cyan/70 sm:tracking-[0.4em]">
                  Valeurs cle
                </p>
                <ul className="mt-4 space-y-3 text-[clamp(0.9rem,1.2vw,1.1rem)] text-slate-200">
                  <li className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-neon-cyan shadow-[0_0_10px_rgba(45,250,255,0.9)]" />
                    Esprit d&apos;equipe et respect.
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-neon-lime shadow-[0_0_10px_rgba(183,255,42,0.9)]" />
                    Creation sonore et lumiere precise.
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-neon-cyan shadow-[0_0_10px_rgba(45,250,255,0.9)]" />
                    Rigueur, mais toujours avec plaisir.
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl border border-neon-cyan/30 bg-midnight/70 px-6 py-6 shadow-[0_0_20px_rgba(45,250,255,0.12)]">
                <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.25em] text-neon-cyan/70 sm:tracking-[0.4em]">
                  <span>Statut</span>
                  <span className="text-neon-lime">Actif</span>
                </div>
                <div className="mt-4 space-y-3 text-[clamp(0.9rem,1.2vw,1.1rem)] text-slate-200">
                  <div className="flex items-center justify-between rounded-2xl border border-neon-cyan/20 bg-slate-950/70 px-4 py-3">
                    <span>Formation</span>
                    <span className="text-neon-cyan">En ligne</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-neon-cyan/20 bg-slate-950/70 px-4 py-3">
                    <span>Acces</span>
                    <span className="text-neon-cyan">Valide</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-neon-cyan/20 bg-slate-950/70 px-4 py-3">
                    <span>Mission</span>
                    <span className="text-neon-cyan">Demarrage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
