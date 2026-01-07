"use client";

import type { Variants } from "framer-motion";
import type { CSSProperties } from "react";
import {
  AnimatePresence,
  cubicBezier,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import HumanityBar from "@/components/HumanityBar";
import NeonButton from "@/components/NeonButton";
import {
  FINAL_PERCENT,
  HUMANITY_MAX,
  QUESTIONS,
  buildProgressWeights,
  getProgressPercent,
} from "@/data/quiz";
import useQuestionTimer from "@/hooks/useQuestionTimer";

const DURATION_PER_Q_MS = 20_000;
const FADE_DURATION_MS = 600;
const BAR_ANIM_MS = 5000;

const LED_MIN_WIDTH = 2200;
const LED_MIN_HEIGHT = 1200;

const getLowestChoiceIndex = (scores: number[]) => {
  let lowest = 0;
  for (let i = 1; i < scores.length; i += 1) {
    if (scores[i] < scores[lowest]) {
      lowest = i;
    }
  }
  return lowest;
};

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
  const {
    questionIndex: activeIndex,
    phase: syncedPhase,
    timeLeftSeconds,
    timeLeftRatio,
    cycleId,
  } = useQuestionTimer({
    questionDurationMs: DURATION_PER_Q_MS,
    barDurationMs: BAR_ANIM_MS,
    totalQuestions: QUESTIONS.length,
  });
  const [answered, setAnswered] = useState<Record<number, number>>({});
  const [humanity, setHumanity] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [pulseIndex, setPulseIndex] = useState<number | null>(null);
  const [uiState, dispatch] = useReducer(uiReducer, initialUiState);

  const answeredRef = useRef(answered);
  const completedRef = useRef(completed);
  const resolvingRef = useRef(false);
  const lastResolvedIndexRef = useRef<number | null>(null);
  const completionTimeoutRef = useRef<number | null>(null);
  const fadeTimeoutRef = useRef<number | null>(null);
  const releaseTimeoutRef = useRef<number | null>(null);
  const progressWeights = useMemo(
    () => buildProgressWeights(QUESTIONS.length, cycleId),
    [cycleId]
  );

  useEffect(() => {
    answeredRef.current = answered;
  }, [answered]);

  useEffect(() => {
    completedRef.current = completed;
  }, [completed]);

  useEffect(() => {
    return () => {
      if (completionTimeoutRef.current !== null) {
        window.clearTimeout(completionTimeoutRef.current);
      }
      if (fadeTimeoutRef.current !== null) {
        window.clearTimeout(fadeTimeoutRef.current);
      }
      if (releaseTimeoutRef.current !== null) {
        window.clearTimeout(releaseTimeoutRef.current);
      }
    };
  }, []);

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
    answeredRef.current = {};
    lastResolvedIndexRef.current = null;
    const timerId = window.setTimeout(() => {
      setAnswered({});
      setHumanity(0);
      setPulseIndex(null);
    }, 0);
    return () => window.clearTimeout(timerId);
  }, [cycleId, completed]);

  useEffect(() => {
    if (completed) {
      return;
    }
    if (syncedPhase !== "question") {
      return;
    }
    dispatch({ type: "RESET_QUESTION" });
    const id = window.requestAnimationFrame(() => {
      dispatch({ type: "READY" });
    });
    return () => window.cancelAnimationFrame(id);
  }, [activeIndex, completed, syncedPhase]);

  const currentQuestion = QUESTIONS[activeIndex] ?? QUESTIONS[0];
  const selectedChoice = answered[activeIndex];
  const isUrgent = timeLeftSeconds <= 10;
  const ringRadius = 45;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - timeLeftRatio);
  const ringTransition = reduceMotion
    ? "none"
    : "stroke-dashoffset 0.2s linear";
  const resultPercent = Math.round(humanity);
  const hudRadius = 78;
  const hudCircumference = 2 * Math.PI * hudRadius;
  const hudOffset = hudCircumference * (1 - resultPercent / 100);
  const hudStyles = {
    "--hud-circ": `${hudCircumference}`,
    "--hud-offset": `${hudOffset}`,
  } as CSSProperties;
  const qaAnimation = uiState.phase === "fade-out" ? "fading" : "visible";
  const easeOut = cubicBezier(0.16, 1, 0.3, 1);
  const easeIn = cubicBezier(0.4, 0, 0.7, 0.2);
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
      y: reduceMotion ? 0 : 10,
      x: reduceMotion ? 0 : [0, -4, 4, -2, 2, 0],
      filter: reduceMotion ? "none" : ["blur(0px)", "blur(4px)", "blur(0px)"],
      transition: {
        duration: reduceMotion ? 0 : FADE_DURATION_MS / 1000,
        ease: easeIn,
        x: reduceMotion ? undefined : { duration: 0.25, repeat: 1 },
        filter: reduceMotion
          ? undefined
          : { duration: 0.6, times: [0, 0.5, 1] },
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

  const lockAnswer = useCallback(
    (choiceIndex: number, questionIndex: number) => {
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
      dispatch({ type: "LOCK" });
      setPulseIndex(questionIndex);
    },
    [dispatch]
  );

  const startResolution = useCallback(
    (questionIndex: number) => {
      if (resolvingRef.current || completedRef.current) {
        return;
      }
      resolvingRef.current = true;
      dispatch({ type: "START_FADE_OUT" });
      if (fadeTimeoutRef.current !== null) {
        window.clearTimeout(fadeTimeoutRef.current);
      }
      fadeTimeoutRef.current = window.setTimeout(() => {
        dispatch({ type: "SHOW_BAR" });
        const nextPercent = getProgressPercent(
          questionIndex,
          progressWeights,
          answeredRef.current
        );
        setHumanity(nextPercent);
        setPulseIndex(null);
      }, FADE_DURATION_MS);
      if (releaseTimeoutRef.current !== null) {
        window.clearTimeout(releaseTimeoutRef.current);
      }
      releaseTimeoutRef.current = window.setTimeout(() => {
        resolvingRef.current = false;
      }, BAR_ANIM_MS);
      if (questionIndex >= QUESTIONS.length - 1) {
        if (completionTimeoutRef.current !== null) {
          window.clearTimeout(completionTimeoutRef.current);
        }
        completionTimeoutRef.current = window.setTimeout(() => {
          const finalPercent = FINAL_PERCENT;
          setHumanity(finalPercent);
          setCompleted(true);
          sessionStorage.setItem("asl_humanity", String(finalPercent));
          sessionStorage.setItem("asl_unlocked", "true");
          window.dispatchEvent(new Event("asl:unlock"));
        }, BAR_ANIM_MS);
      }
    },
    [dispatch, progressWeights]
  );

  const resolveQuestion = useCallback(
    (questionIndex: number) => {
      if (resolvingRef.current || completedRef.current) {
        return;
      }
      let choiceIndex = answeredRef.current[questionIndex];
      if (choiceIndex === undefined) {
        choiceIndex = getLowestChoiceIndex(QUESTIONS[questionIndex]?.scores ?? []);
        lockAnswer(choiceIndex, questionIndex);
      }
      startResolution(questionIndex);
    },
    [lockAnswer, startResolution]
  );

  useEffect(() => {
    if (completed) {
      return;
    }
    if (syncedPhase !== "bar") {
      return;
    }
    if (lastResolvedIndexRef.current === activeIndex) {
      return;
    }
    lastResolvedIndexRef.current = activeIndex;
    const timerId = window.setTimeout(() => {
      resolveQuestion(activeIndex);
    }, 0);
    return () => window.clearTimeout(timerId);
  }, [activeIndex, completed, resolveQuestion, syncedPhase]);

  if (completed) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <div className="relative overflow-hidden rounded-4xl border border-neon-cyan/30 bg-midnight/70 px-5 py-6 shadow-[0_0_40px_rgba(45,250,255,0.25)] sm:px-10 sm:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(76,107,255,0.12),transparent_60%)] opacity-70" />
          <div className="pointer-events-none absolute inset-6 rounded-[24px] border border-neon-cyan/20" />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 rounded-3xl border border-neon-cyan/30 bg-slate-950/70 px-6 py-8 text-center shadow-[0_0_24px_rgba(45,250,255,0.2)] sm:px-10 sm:py-10">
            <p className="text-[clamp(0.55rem,0.8vw,0.8rem)] uppercase tracking-[0.5em] text-neon-cyan/70">
              Resultat
            </p>
            <div className="hud-ring-wrap" style={hudStyles}>
              <svg className="hud-ring" viewBox="0 0 200 200" aria-hidden="true">
                <circle className="hud-ring-track" cx="100" cy="100" r={hudRadius} />
                <circle
                  className="hud-ring-progress"
                  cx="100"
                  cy="100"
                  r={hudRadius}
                />
              </svg>
              <div className="hud-ring-core">
                <div className="tron-font text-[clamp(2rem,6vw,4.6rem)] font-semibold text-neon-cyan text-glow">
                  {resultPercent}%
                </div>
                <div className="text-[clamp(0.55rem,0.8vw,0.75rem)] uppercase tracking-[0.4em] text-neon-cyan/70">
                  Humanite
                </div>
              </div>
              <div className="hud-scan" aria-hidden="true" />
              <div className="hud-grid" aria-hidden="true" />
            </div>
            <div className="h-px w-36 bg-gradient-to-r from-transparent via-neon-cyan/60 to-transparent" />
            <p className="text-[clamp(0.85rem,1.2vw,1.1rem)] text-slate-200">
              Le protocole est stabilise. Tu peux acceder a Kaxon Rouge.
            </p>
            <NeonButton
              href="/kaxon-rouge"
              className="sm:w-auto border-neon-cyan/40 bg-transparent text-neon-cyan/90 hover:bg-neon-cyan/10"
            >
              Acces valide
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
            className="flex w-full flex-col items-center gap-6"
            variants={qaVariants}
            initial="hidden"
            animate={qaAnimation}
            exit="hidden"
          >
            <div className="text-[clamp(10px,1.1vw,16px)] uppercase tracking-[0.5em] text-neon-cyan/80">
              Question {activeIndex + 1} / {QUESTIONS.length}
            </div>
            <div className="text-[clamp(9px,0.9vw,13px)] uppercase tracking-[0.4em] text-neon-cyan/50">
              Regles : 10 dilemmes - 20 s - Humanite 0-100 %
            </div>
            <div className="flex items-center gap-2" aria-hidden="true">
              {QUESTIONS.map((_, index) => {
                const isActive = index <= activeIndex;
                return (
                  <span
                    key={`progress-${index}`}
                    className={`h-1.5 w-1.5 rounded-full ${
                      isActive
                        ? "bg-neon-cyan shadow-[0_0_8px_rgba(45,250,255,0.7)]"
                        : "bg-slate-700/60"
                    }`}
                  />
                );
              })}
            </div>
            <div
              className={`relative tron-font flex items-center justify-center rounded-full border-4 border-neon-cyan/60 bg-neon-cyan/10 p-2 text-neon-cyan shadow-[0_0_40px_rgba(45,250,255,0.7)] animate-pulseGlow ${
                isLedMode
                  ? "h-[clamp(9rem,24.25vh,18.6rem)] w-[clamp(9rem,24.25vh,18.6rem)]"
                  : "h-[clamp(6.7rem,19.25vh,11.8rem)] w-[clamp(6.7rem,19.25vh,11.8rem)]"
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
                className={`font-bold tabular-nums leading-none ${
                  isUrgent ? "urgent-text" : ""
                } ${
                  isLedMode
                    ? "text-[clamp(2.6rem,7vw,6.2rem)]"
                    : "text-[clamp(1.9rem,5vw,4rem)]"
                }`}
              >
                {timeLeftSeconds}
              </span>
              <span
                className={`ml-2 text-[clamp(0.9rem,2vw,2.4rem)] font-semibold leading-none ${
                  isUrgent ? "urgent-text" : ""
                }`}
              >
                s
              </span>
            </div>
            <h2
              className={`glitch-question mx-auto max-w-5xl font-semibold leading-[1.2] text-white normal-case transition duration-300 hover:text-neon-cyan ${
                isLedMode
                  ? "text-[clamp(2rem,5vw,4.6rem)]"
                  : "text-[clamp(1.45rem,3.9vw,3.1rem)]"
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
                const labelClass = isSelected
                  ? "text-neon-lime/90"
                  : "text-neon-cyan/90";
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
                        uiState.phase !== "question" ||
                        (uiState.isLocked && !isSelected)
                      }
                      className={`min-h-[clamp(50px,7.5vh,80px)] items-center justify-between gap-6 rounded-3xl border-2 px-6 py-5 text-left tracking-normal transition duration-300 hover:-translate-y-0.5 hover:bg-neon-cyan/10 hover:border-neon-cyan hover:shadow-neon ${
                        isLedMode
                          ? "text-[clamp(1.25rem,3vw,2.8rem)]"
                          : "text-[clamp(1rem,2.2vw,1.9rem)]"
                      } ${
                        isSelected
                          ? "border-neon-lime/80 text-neon-lime bg-neon-lime/10 shadow-[0_0_18px_rgba(183,255,42,0.35)]"
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
