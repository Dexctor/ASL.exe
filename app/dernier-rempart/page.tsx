import GameEngine from "@/components/GameEngine";

export default function DernierRempartPage() {
  return (
    <main className="relative z-10">
      <section className="mx-auto flex h-[calc(100svh-88px)] w-full max-w-screen-2xl flex-col justify-center overflow-hidden px-4 pb-4 pt-2 sm:h-[calc(100vh-120px)] sm:px-6 sm:pb-6">
        <GameEngine />
      </section>
    </main>
  );
}
