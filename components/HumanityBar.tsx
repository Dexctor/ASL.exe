"use client";

import { useEffect, useRef, useState } from "react";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

type Props = {
  value: number;
  max?: number;
  isLedMode?: boolean;
  transitionMs?: number;
};

export default function HumanityBar({
  value,
  max = 100,
  isLedMode,
  transitionMs = 700,
}: Props) {
  const clamped = Math.min(value, max);
  const percentage = Math.min(100, (clamped / max) * 100);
  const [animatedPercent, setAnimatedPercent] = useState(percentage);
  const animatedRef = useRef(percentage);
  const displayPercent = Math.round(animatedPercent);
  const labelClass = isLedMode
    ? "text-[clamp(1rem,2.4vw,2.6rem)]"
    : "text-[clamp(0.8rem,2vw,1.3rem)]";
  const barClass = isLedMode
    ? "h-[clamp(18px,4vh,44px)]"
    : "h-[clamp(14px,3vh,24px)]";

  useEffect(() => {
    if (transitionMs <= 0) {
      animatedRef.current = percentage;
      let rafId = 0;
      rafId = window.requestAnimationFrame(() => {
        setAnimatedPercent(percentage);
      });
      return () => window.cancelAnimationFrame(rafId);
    }
    if (animatedRef.current === percentage) {
      return;
    }
    const startValue = animatedRef.current;
    const delta = percentage - startValue;
    const startTime = performance.now();
    let rafId = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / transitionMs);
      const eased = easeOutCubic(progress);
      const nextValue = startValue + delta * eased;
      animatedRef.current = nextValue;
      setAnimatedPercent(nextValue);
      if (progress < 1) {
        rafId = window.requestAnimationFrame(tick);
      }
    };
    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [percentage, transitionMs]);

  return (
    <div className="glass-panel rounded-3xl px-6 py-5">
      <div
        className={`flex items-center justify-between uppercase tracking-[0.3em] text-neon-cyan/90 ${labelClass}`}
      >
        <span>Humanite</span>
        <span>{displayPercent}%</span>
      </div>
      <div
        className={`relative mt-4 w-full overflow-hidden rounded-full bg-slate-900/80 ${barClass}`}
      >
        <div
          className="liquid-fill h-full rounded-full"
          style={{ width: `${animatedPercent}%` }}
        />
      </div>
    </div>
  );
}
