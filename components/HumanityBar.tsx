type Props = {
  value: number;
  max?: number;
  isLedMode?: boolean;
};

export default function HumanityBar({ value, max = 70, isLedMode }: Props) {
  const clamped = Math.min(value, max);
  const percentage = Math.min(100, (clamped / max) * 100);
  const labelClass = isLedMode
    ? "text-[clamp(1rem,2.4vw,2.6rem)]"
    : "text-[clamp(0.8rem,2vw,1.3rem)]";
  const barClass = isLedMode
    ? "h-[clamp(18px,4vh,44px)]"
    : "h-[clamp(14px,3vh,24px)]";

  return (
    <div className="glass-panel rounded-3xl px-6 py-5">
      <div
        className={`flex items-center justify-between uppercase tracking-[0.3em] text-neon-lime/90 ${labelClass}`}
      >
        <span>Humanite</span>
        <span>{Math.round(clamped)}%</span>
      </div>
      <div
        className={`relative mt-4 w-full overflow-hidden rounded-full bg-slate-900/80 ${barClass}`}
      >
        <div
          className="liquid-fill h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-neon-lime/20">
        <div className="h-full w-1/2 animate-sweep bg-neon-lime/80" />
      </div>
    </div>
  );
}
