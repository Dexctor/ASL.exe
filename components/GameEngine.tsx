"use client";

import type { Variants } from "framer-motion";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import HumanityBar from "@/components/HumanityBar";
import NeonButton from "@/components/NeonButton";
import { HUMANITY_MAX, QUESTIONS, getProgressPercent } from "@/data/quiz";
import useQuestionTimer from "@/hooks/useQuestionTimer";

const DURATION_PER_Q_MS = 20_000;
const FADE_DURATION_MS = 600;
const BAR_ANIM_MS = 5000;
const getLowestChoiceIndex = (scores: number[]) => {
  let lowest = 0;
  for (let i = 1; i < scores.length; i += 1) {
    if (scores[i] < scores[lowest]) {
      lowest = i;
    }
  }
  return lowest;
};

const LED_MIN_WIDTH = 2200;
const LED_MIN_HEIGHT = 1200;

type Phase = "question" | "fade-out" | "bar" | "fade-in";

type UiState = {
  phase: Phase;
  showQA: boolean;
  isLocked: boolean;
};

type UiAction =
  | { type: "RESET_QUESTION" }
  | { type: "READY" }
  | { type: "LOCK" }
  | { type: "START_FADE_OUT" }
  | { type: "SHOW_BAR" };

const initialUiState: UiState = {
  phase: "question",
  showQA: true,
  isLocked: false,
};

const uiReducer = (state: UiState, action: UiAction): UiState => {
  switch (action.type) {
    case "RESET_QUESTION":
      return { phase: "fade-in", showQA: true, isLocked: false };
    case "READY":
      return { ...state, phase: "question" };
    case "LOCK":
      return { ...state, isLocked: true };
    case "START_FADE_OUT":
      return { ...state, phase: "fade-out" };
    case "SHOW_BAR":
      return { ...state, phase: "bar", showQA: false };
    default:
      return state;
  }
};

export default function GameEngine() {
  const reduceMotion = useReducedMotion();
  const [isLedMode, setIsLedMode] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { offsetMs, startMs: questionStartMs, timeLeftSeconds, timeLeftRatio } =
    useQuestionTimer({
      durationMs: DURATION_PER_Q_MS,
      resetKey: activeIndex,
    });
  const [answered, setAnswered] = useState<Record<number, number>>({});
  const [humanity, setHumanity] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [pulseIndex, setPulseIndex] = useState<number | null>(null);
  const [uiState, dispatch] = useReducer(uiReducer, initialUiState);

  const answeredRef = useRef(answered);
  const completedRef = useRef(completed);
  const resolvingRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const hasInteractedRef = useRef(false);
  const lastBeepSecondRef = useRef<number | null>(null);

  useEffect(() => {
    answeredRef.current = answered;
  }, [answered]);

  useEffect(() => {
    completedRef.current = completed;
  }, [completed]);

  useEffect(() => {
    const update = () => {
      setIsLedMode(
        window.innerWidth >= LED_MIN_WIDTH &&
          window.innerHeight >= LED_MIN_HEIGHT
      );
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (completed) {
      return;
    }
    dispatch({ type: "RESET_QUESTION" });
    lastBeepSecondRef.current = null;
    const id = window.requestAnimationFrame(() => {
      dispatch({ type: "READY" });
    });
    return () => window.cancelAnimationFrame(id);
  }, [activeIndex, completed]);

  const currentQuestion = QUESTIONS[activeIndex];
  const selectedChoice = answered[activeIndex];
  const isUrgent = timeLeftSeconds <= 10;
  const ringRadius = 45;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - timeLeftRatio);
  const ringTransition = reduceMotion ? "none" : "stroke-dashoffset 0.2s linear";
  const qaAnimation = uiState.phase === "fade-out" ? "fading" : "visible";
  const easeOut = [0.16, 1, 0.3, 1] as const;
  const easeIn = [0.4, 0, 0.7, 0.2] as const;
  const qaVariants: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.35,
        ease: easeOut,
      },
    },
    fading: {
      opacity: 0,
      y: reduceMotion ? 0 : 8,
      transition: {
        duration: reduceMotion ? 0 : FADE_DURATION_MS / 1000,
        ease: easeIn,
      },
    },
  };
  const choiceVariants: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 10 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: reduceMotion ? 0 : index * 0.05,
        duration: reduceMotion ? 0 : 0.25,
        ease: easeOut,
      },
    }),
  };

  const getAudioContext = useCallback(() => {
    if (typeof window === "undefined") {
      return null;
    }
    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextClass) {
        return null;
      }
      audioContextRef.current = new AudioContextClass();
    }
    return audioContextRef.current;
  }, []);

  const markInteracted = useCallback(() => {
    hasInteractedRef.current = true;
    const context = getAudioContext();
    if (context && context.state === "suspended") {
      void context.resume();
    }
  }, [getAudioContext]);

  const playTone = useCallback(
    (
      frequency: number,
      duration: number,
      type: OscillatorType,
      volume: number
    ) => {
      if (!hasInteractedRef.current) {
        return;
      }
      const context = getAudioContext();
      if (!context) {
        return;
      }
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      oscillator.connect(gain);
      gain.connect(context.destination);
      const now = context.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      oscillator.start(now);
      oscillator.stop(now + duration);
    },
    [getAudioContext]
  );

  const playClick = useCallback(() => {
    playTone(900, 0.05, "square", 0.04);
  }, [playTone]);

  const playUrgentBeep = useCallback(() => {
    playTone(740, 0.08, "sine", 0.05);
  }, [playTone]);

  useEffect(() => {
    return () => {
      const context = audioContextRef.current;
      if (context && context.state !== "closed") {
        context.close().catch(() => {});
      }
    };
  }, []);



  const lockAnswer = useCallback((
    choiceIndex: number,
    questionIndex: number,
    withSound = true
  ) => {
    if (
      completedRef.current ||
      answeredRef.current[questionIndex] !== undefined
    ) {
      return;
    }
    answeredRef.current = {
      ...answeredRef.current,
      [questionIndex]: choiceIndex,
    };
    setAnswered((prev) => ({
      ...prev,
      [questionIndex]: choiceIndex,
    }));
    if (withSound) {
      markInteracted();
      playClick();
    }
    dispatch({ type: "LOCK" });
    setPulseIndex(questionIndex);
  }, [dispatch, markInteracted, playClick]);

  const startResolution = useCallback(
    (questionIndex: number) => {
      if (resolvingRef.current || completedRef.current) {
        return;
      }
      resolvingRef.current = true;
      dispatch({ type: "START_FADE_OUT" });
      setTimeout(() => {
        dispatch({ type: "SHOW_BAR" });
        const nextPercent = getProgressPercent(questionIndex);
        setHumanity(nextPercent);
        setPulseIndex(null);
      }, FADE_DURATION_MS);
      setTimeout(() => {
        resolvingRef.current = false;
        if (questionIndex < QUESTIONS.length - 1) {
          setActiveIndex(questionIndex + 1);
        } else {
          setCompleted(true);
          sessionStorage.setItem("asl_unlocked", "true");
        }
      }, FADE_DURATION_MS + BAR_ANIM_MS);
    },
    [dispatch]
  );

  const resolveQuestion = useCallback(
    (questionIndex: number) => {
      if (resolvingRef.current || completedRef.current) {
        return;
      }
      let choiceIndex = answeredRef.current[questionIndex];
      if (choiceIndex === undefined) {
        choiceIndex = getLowestChoiceIndex(
          QUESTIONS[questionIndex]?.scores ?? []
        );
        lockAnswer(choiceIndex, questionIndex, false);
      }
      startResolution(questionIndex);
    },
    [lockAnswer, startResolution]
  );

  useEffect(() => {
    if (completed) {
      return;
    }
    const now = Date.now() + offsetMs;
    const elapsed = now - questionStartMs;
    const timeLeft = Math.max(0, DURATION_PER_Q_MS - elapsed);
    const timeoutId = window.setTimeout(() => {
      resolveQuestion(activeIndex);
    }, timeLeft + 20);
    return () => window.clearTimeout(timeoutId);
  }, [activeIndex, completed, offsetMs, questionStartMs, resolveQuestion]);

  useEffect(() => {
    if (completed || uiState.phase !== "question") {
      return;
    }
    if (timeLeftSeconds > 3 || timeLeftSeconds <= 0) {
      return;
    }
    if (lastBeepSecondRef.current === timeLeftSeconds) {
      return;
    }
    playUrgentBeep();
    lastBeepSecondRef.current = timeLeftSeconds;
  }, [completed, playUrgentBeep, timeLeftSeconds, uiState.phase]);

  if (completed) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <div className="relative overflow-hidden rounded-[32px] border border-neon-cyan/30 bg-midnight/70 px-5 py-6 shadow-[0_0_40px_rgba(45,250,255,0.25)] sm:px-10 sm:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(76,107,255,0.12),transparent_60%)] opacity-70" />
          <div className="pointer-events-none absolute inset-6 rounded-[24px] border border-neon-cyan/20" />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-3xl border border-neon-cyan/30 bg-slate-950/70 px-6 py-8 text-center shadow-[0_0_24px_rgba(45,250,255,0.2)] sm:px-10 sm:py-10">
            <p className="text-[clamp(0.55rem,0.8vw,0.8rem)] uppercase tracking-[0.5em] text-neon-cyan/70">
              Résultat
            </p>
            <h2 className="tron-font text-[clamp(1.4rem,3.2vw,3.2rem)] font-semibold text-neon-cyan">
              Humanité : {Math.round(humanity)}%
            </h2>
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-neon-cyan/60 to-transparent" />
            <p className="text-[clamp(0.85rem,1.2vw,1.1rem)] text-slate-200">
              Le protocole est stabilisé. Tu peux accéder à Kaxon Rouge.
            </p>
            <NeonButton
              href="/kaxon-rouge"
              className="sm:w-auto border-neon-cyan/40 bg-transparent text-neon-cyan/90 hover:bg-neon-cyan/10"
            >
              Accès valide
            </NeonButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex h-full min-h-0 flex-col items-center gap-4 text-center ${
        uiState.showQA ? "justify-between" : "justify-center"
      }`}
    >
      <AnimatePresence mode="wait">
        {uiState.showQA ? (
          <motion.div
            key={activeIndex}
            className="flex w-full flex-col items-center gap-4"
            variants={qaVariants}
            initial="hidden"
            animate={qaAnimation}
            exit="hidden"
          >
      <div className="text-[clamp(10px,1.1vw,16px)] uppercase tracking-[0.5em] text-neon-cyan/80">
        Question {activeIndex + 1} / {QUESTIONS.length}
      </div>
      <div className="text-[clamp(9px,0.9vw,13px)] uppercase tracking-[0.4em] text-neon-cyan/50">
        Règles : 10 dilemmes - 20 s - Humanité 0-100 %
      </div>
      <div
        className={`relative tron-font flex items-center justify-center rounded-full border-4 border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan shadow-[0_0_40px_rgba(45,250,255,0.7)] animate-pulseGlow ${
          isLedMode
            ? "h-[clamp(6.5rem,18vh,13.5rem)] w-[clamp(6.5rem,18vh,13.5rem)]"
            : "h-[clamp(4.8rem,14vh,8.5rem)] w-[clamp(4.8rem,14vh,8.5rem)]"
        } ${isUrgent ? "urgent-timer" : ""}`}
      >
        <svg
          className="pointer-events-none absolute inset-0 -rotate-90"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r={ringRadius}
            fill="transparent"
            stroke="rgba(45,250,255,0.2)"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r={ringRadius}
            fill="transparent"
            stroke={isUrgent ? "#ff5edb" : "rgba(45,250,255,0.9)"}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={ringCircumference}
            strokeDashoffset={ringOffset}
            style={{ transition: ringTransition }}
          />
        </svg>
        <span
          className={`font-bold tabular-nums ${isUrgent ? "urgent-text" : ""} ${
            isLedMode
              ? "text-[clamp(2.6rem,7vw,6.2rem)]"
              : "text-[clamp(1.9rem,5vw,4rem)]"
          }`}
        >
          {timeLeftSeconds}
        </span>
        <span
          className={`ml-2 text-[clamp(0.9rem,2vw,2.4rem)] font-semibold ${
            isUrgent ? "urgent-text" : ""
          }`}
        >
          s
        </span>
      </div>
      <h2
        className={`glitch-question mx-auto max-w-5xl font-semibold leading-[1.2] text-white normal-case transition duration-300 hover:text-neon-cyan ${
          isLedMode
            ? "text-[clamp(1.8rem,4.6vw,4.2rem)]"
            : "text-[clamp(1.3rem,3.6vw,2.8rem)]"
        } ${isUrgent ? "glitch-urgent" : ""}`}
        data-text={currentQuestion.title}
        aria-live="polite"
      >
        {currentQuestion.title}
      </h2>
      <div className="grid w-full max-w-5xl gap-3">
        {currentQuestion.choices.map((choice, index) => {
          const label = String.fromCharCode(65 + index);
          const isSelected = selectedChoice === index;
          const shouldPulse = isSelected && pulseIndex === activeIndex;
          const labelClass = isSelected ? "text-neon-lime/90" : "text-neon-cyan/90";
          return (
            <motion.div
              key={`${activeIndex}-${index}`}
              custom={index}
              variants={choiceVariants}
              initial="hidden"
              animate="visible"
            >
              <NeonButton
                onClick={() => lockAnswer(index, activeIndex)}
                disabled={
                  uiState.phase !== "question" || (uiState.isLocked && !isSelected)
                }
                className={`min-h-[clamp(50px,7.5vh,80px)] items-center justify-between gap-6 rounded-3xl border-2 px-6 py-5 text-left tracking-normal transition duration-300 hover:-translate-y-0.5 hover:bg-neon-cyan/10 hover:border-neon-cyan hover:shadow-neon ${
                  isLedMode
                    ? "text-[clamp(1.25rem,3vw,2.8rem)]"
                    : "text-[clamp(1rem,2.2vw,1.9rem)]"
                } ${
                  isSelected
                    ? "border-neon-lime/80 text-neon-lime bg-neon-lime/10"
                    : "border-neon-cyan/60 text-white"
                } ${
                  shouldPulse
                    ? "animate-[pulseGlow_0.35s_ease-in-out_1] shadow-[0_0_24px_rgba(183,255,42,0.85)] choice-sweep"
                    : ""
                } normal-case`}
              >
                <span
                  className={`text-[clamp(0.85rem,1.8vw,2.2rem)] font-semibold uppercase tracking-[0.5em] ${labelClass}`}
                >
                  {label}
                </span>
                <span className="flex-1">{choice}</span>
              </NeonButton>
            </motion.div>
          );
        })}
      </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="w-full max-w-5xl">
        <HumanityBar
          value={humanity}
          max={HUMANITY_MAX}
          isLedMode={isLedMode}
          transitionMs={uiState.phase === "bar" ? BAR_ANIM_MS : 700}
        />
      </div>
    </div>
  );
}
