"use client";

import { useEffect, useState } from "react";

type Options = {
  questionDurationMs: number;
  barDurationMs: number;
  totalQuestions: number;
};

const getInitialSeconds = (durationMs: number) =>
  Math.ceil(durationMs / 1000);

export default function useQuestionTimer({
  questionDurationMs,
  barDurationMs,
  totalQuestions,
}: Options) {
  const [offsetMs, setOffsetMs] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [phase, setPhase] = useState<"question" | "bar">("question");
  const [timeLeftMs, setTimeLeftMs] = useState(questionDurationMs);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(
    getInitialSeconds(questionDurationMs)
  );
  const [timeLeftRatio, setTimeLeftRatio] = useState(1);
  const [cycleId, setCycleId] = useState(0);

  useEffect(() => {
    let active = true;
    fetch("/api/time")
      .then((res) => res.json())
      .then((data) => {
        if (!active) {
          return;
        }
        const nextOffset = data.serverNow - Date.now();
        const timerId = window.setTimeout(() => {
          setOffsetMs(nextOffset);
        }, 0);
        return () => window.clearTimeout(timerId);
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
    const phaseDurationMs = questionDurationMs + barDurationMs;
    const gameCycleMs = phaseDurationMs * totalQuestions;

    const tick = () => {
      const now = Date.now() + offsetMs;
      const elapsedCycle = ((now % gameCycleMs) + gameCycleMs) % gameCycleMs;
      const nextIndex = Math.floor(elapsedCycle / phaseDurationMs);
      const phaseElapsed = elapsedCycle % phaseDurationMs;
      const nextPhase = phaseElapsed < questionDurationMs ? "question" : "bar";
      const remainingMs =
        nextPhase === "question"
          ? questionDurationMs - phaseElapsed
          : phaseDurationMs - phaseElapsed;

      setQuestionIndex(nextIndex);
      setPhase(nextPhase);
      setTimeLeftMs(remainingMs);
      setTimeLeftSeconds(Math.max(0, Math.ceil(remainingMs / 1000)));
      setTimeLeftRatio(
        nextPhase === "question" && questionDurationMs > 0
          ? Math.max(0, remainingMs / questionDurationMs)
          : 0
      );
      setCycleId(Math.floor(now / gameCycleMs));
    };

    let rafId = 0;
    rafId = window.requestAnimationFrame(tick);
    const intervalId = window.setInterval(tick, 100);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearInterval(intervalId);
    };
  }, [barDurationMs, offsetMs, questionDurationMs, totalQuestions]);

  return {
    offsetMs,
    questionIndex,
    phase,
    timeLeftMs,
    timeLeftSeconds,
    timeLeftRatio,
    cycleId,
  };
}
