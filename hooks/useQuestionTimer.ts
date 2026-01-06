"use client";

import { useEffect, useMemo, useState } from "react";

type Options = {
  durationMs: number;
  resetKey: number;
};

const getInitialSeconds = (durationMs: number) =>
  Math.ceil(durationMs / 1000);

export default function useQuestionTimer({ durationMs, resetKey }: Options) {
  const initialSeconds = useMemo(
    () => getInitialSeconds(durationMs),
    [durationMs]
  );
  const [offsetMs, setOffsetMs] = useState(0);
  const [startMs, setStartMs] = useState(0);
  const [timeLeftMs, setTimeLeftMs] = useState(durationMs);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(initialSeconds);
  const [timeLeftRatio, setTimeLeftRatio] = useState(1);

  useEffect(() => {
    let active = true;
    fetch("/api/time")
      .then((res) => res.json())
      .then((data) => {
        if (!active) {
          return;
        }
        setOffsetMs(data.serverNow - Date.now());
      })
      .catch(() => {
        if (!active) {
          return;
        }
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const nextStart = Date.now() + offsetMs;
    let rafId = 0;
    rafId = window.requestAnimationFrame(() => {
      setStartMs(nextStart);
      setTimeLeftMs(durationMs);
      setTimeLeftSeconds(initialSeconds);
      setTimeLeftRatio(1);
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [durationMs, initialSeconds, offsetMs, resetKey]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const now = Date.now() + offsetMs;
      const elapsed = now - startMs;
      const remaining = Math.max(0, durationMs - elapsed);
      setTimeLeftMs(remaining);
      setTimeLeftSeconds(Math.max(0, Math.ceil(remaining / 1000)));
      setTimeLeftRatio(durationMs > 0 ? Math.max(0, remaining / durationMs) : 0);
    }, 100);
    return () => window.clearInterval(id);
  }, [durationMs, offsetMs, startMs]);

  return {
    offsetMs,
    startMs,
    timeLeftMs,
    timeLeftSeconds,
    timeLeftRatio,
  };
}
