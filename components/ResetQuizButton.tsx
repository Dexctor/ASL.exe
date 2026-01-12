"use client";

export default function ResetQuizButton() {
  const handleReset = () => {
    window.dispatchEvent(new Event("asl:reset"));
  };

  return (
    <button
      type="button"
      onClick={handleReset}
      className="inline-flex max-w-full items-center justify-center rounded-full border border-neon-cyan/60 bg-midnight/70 px-5 py-3 text-center text-[0.7rem] uppercase tracking-[0.2em] text-neon-cyan transition hover:bg-neon-cyan/10 hover:text-white sm:tracking-[0.35em]"
    >
      <span className="whitespace-normal">Recommencer la simulation</span>
    </button>
  );
}
