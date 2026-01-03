import Link from "next/link";

const cards = [
  {
    href: "/dernier-rempart",
    title: "Le Dernier Rempart",
  },
  {
    href: "/bienvenue-les-asl",
    title: "Bienvenue les ASL",
  },
  {
    href: "/best-team",
    title: "La Best Team",
  },
];

export default function Home() {
  return (
    <main className="relative z-10">
      <section className="mx-auto flex min-h-[calc(100vh-120px)] max-w-screen-xl flex-col justify-center gap-10 px-6 pb-16 pt-8 text-center sm:pt-14">
        <div className="mx-auto max-w-4xl">
          <p className="text-[clamp(10px,1vw,16px)] uppercase tracking-[0.5em] text-neon-cyan/80">
            Protocole d'accueil
          </p>
          <h1
            className="tron-font glitch-text mt-5 text-[clamp(2.2rem,5.5vw,5.2rem)] font-semibold tracking-[0.35em] text-white"
            data-text="ASL.EXE"
          >
            ASL.EXE
          </h1>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative overflow-hidden rounded-3xl border border-neon-cyan/30 bg-midnight/70 p-7 text-left transition duration-300 hover:-translate-y-1 hover:border-neon-cyan/60 hover:bg-midnight/80 hover:shadow-neon hover:scale-[1.01]"
            >
              <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-neon-cyan/10 blur-2xl transition group-hover:bg-neon-cyan/20" />
              <h2 className="tron-font text-[clamp(1.2rem,2vw,2.1rem)] font-semibold text-white">
                {card.title}
              </h2>
              <span className="mt-6 inline-flex text-[clamp(0.7rem,0.9vw,0.95rem)] uppercase tracking-[0.3em] text-neon-cyan">
                Accès
              </span>
            </Link>
          ))}
        </div>
        <p className="mx-auto max-w-4xl text-[clamp(0.95rem,1.6vw,1.4rem)] text-slate-200 normal-case">
          Un espace néon pour synchroniser la mission, tester tes choix et
          rejoindre la Best Team. Connecte-toi, le système est en ligne.
        </p>
      </section>
    </main>
  );
}
