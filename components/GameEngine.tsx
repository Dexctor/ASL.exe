"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import HumanityBar from "@/components/HumanityBar";
import NeonButton from "@/components/NeonButton";

const QUESTIONS = [
  {
    title: "Vous pouvez sauver un ami ou cinq inconnus.",
    choices: ["Sauver l ami", "Sauver les cinq", "Chercher une autre solution"],
  },
  {
    title: "Dire la verite detruirait quelqu un emotionnellement.",
    choices: ["Dire la verite", "Mentir", "Adapter la verite"],
  },
  {
    title: "Une erreur vous avantage mais penalise un autre.",
    choices: ["Profiter", "Corriger", "Hesiter puis decider"],
  },
  {
    title: "Une regle est injuste mais officielle.",
    choices: ["L appliquer", "La contourner", "La contester"],
  },
  {
    title: "Un jugement est legal mais immoral.",
    choices: ["L accepter", "Le denoncer", "Le nuancer"],
  },
  {
    title: "Vous avez raison mais personne n est pret a l entendre.",
    choices: ["Insister", "Attendre", "Adapter le message"],
  },
  {
    title: "Un choix sauve aujourd hui mais cree un probleme demain.",
    choices: ["Choisir aujourd hui", "Penser long terme", "Chercher un compromis"],
  },
  {
    title: "Une personne refuse l aide dont elle a besoin.",
    choices: ["Forcer", "Respecter", "Convaincre doucement"],
  },
  {
    title: "Vous pouvez tricher sans etre vu.",
    choices: ["Tricher", "Refuser", "Douter puis decider"],
  },
  {
    title: "Pardonner quelqu un qui ne s excuse pas.",
    choices: ["Pardonner", "Couper les liens", "Prendre du recul"],
  },
];

const DURATION_PER_Q_MS = 20_000;
const INITIAL_SECONDS = Math.ceil(DURATION_PER_Q_MS / 1000);

const xmur3 = (str: string) => {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i += 1) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
};

const mulberry32 = (seed: number) => {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const buildIncrements = (seed: string, count: number, total: number) => {
  const seedFn = xmur3(seed);
  const rand = mulberry32(seedFn());
  const weights = Array.from({ length: count }, () => rand() + 0.2);
  const weightSum = weights.reduce((acc, value) => acc + value, 0);
  const raw = weights.map((value) => (value / weightSum) * total);
  const floored = raw.map((value) => Math.floor(value));
  let remainder = total - floored.reduce((acc, value) => acc + value, 0);
  const fractional = raw
    .map((value, index) => ({ index, frac: value - Math.floor(value) }))
    .sort((a, b) => b.frac - a.frac);
  for (let i = 0; i < fractional.length && remainder > 0; i += 1) {
    floored[fractional[i].index] += 1;
    remainder -= 1;
  }
  return floored;
};

const LED_MIN_WIDTH = 2200;
const LED_MIN_HEIGHT = 1200;

export default function GameEngine() {
  const [isLedMode, setIsLedMode] = useState(false);
  const increments = useMemo(
    () => buildIncrements("ASL2026", QUESTIONS.length, 70),
    []
  );
  const [offsetMs, setOffsetMs] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [questionStartMs, setQuestionStartMs] = useState(Date.now());
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(INITIAL_SECONDS);
  const [answered, setAnswered] = useState<Record<number, string>>({});
  const [humanity, setHumanity] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [pulseIndex, setPulseIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const answeredRef = useRef(answered);
  const completedRef = useRef(completed);

  useEffect(() => {
    answeredRef.current = answered;
  }, [answered]);

  useEffect(() => {
    completedRef.current = completed;
  }, [completed]);

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
    setQuestionStartMs(Date.now() + offsetMs);
    setTimeLeftSeconds(INITIAL_SECONDS);
  }, [offsetMs]);

  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now() + offsetMs;
      const elapsed = now - questionStartMs;
      const timeLeftMs = Math.max(0, DURATION_PER_Q_MS - elapsed);
      setTimeLeftSeconds(Math.max(0, Math.ceil(timeLeftMs / 1000)));
    }, 200);
    return () => clearInterval(id);
  }, [offsetMs, questionStartMs]);

  const answeredCount = Object.keys(answered).length;
  const currentQuestion = QUESTIONS[activeIndex];
  const selectedChoice = answered[activeIndex];
  const isUrgent = timeLeftSeconds <= 10;

  const handleAnswer = useCallback(
    (choice: string, index: number) => {
      if (completedRef.current || answeredRef.current[index]) {
        return;
      }
      setAnswered((prev) => ({
        ...prev,
        [index]: choice,
      }));
      setHumanity((prev) => Math.min(70, prev + increments[index]));
      setPulseIndex(index);
      setIsTransitioning(true);
      window.setTimeout(() => {
        setPulseIndex(null);
        setIsTransitioning(false);
        if (index < QUESTIONS.length - 1) {
          setActiveIndex(index + 1);
          setQuestionStartMs(Date.now() + offsetMs);
          setTimeLeftSeconds(INITIAL_SECONDS);
        }
      }, 280);
    },
    [increments, offsetMs]
  );

  useEffect(() => {
    if (completed) {
      return;
    }
    const now = Date.now() + offsetMs;
    const elapsed = now - questionStartMs;
    const timeLeft = Math.max(0, DURATION_PER_Q_MS - elapsed);
    const timeoutId = setTimeout(() => {
      if (!answeredRef.current[activeIndex] && !completedRef.current) {
        handleAnswer("C", activeIndex);
      }
    }, timeLeft + 10);
    return () => clearTimeout(timeoutId);
  }, [activeIndex, completed, handleAnswer, offsetMs, questionStartMs]);

  useEffect(() => {
    if (completed || answeredCount < QUESTIONS.length) {
      return;
    }
    setCompleted(true);
    setUnlocked(true);
    setHumanity(70);
    sessionStorage.setItem("asl_unlocked", "true");
  }, [answeredCount, completed]);

  if (completed) {
    return (
      <div className="mt-10 glass-panel rounded-3xl px-6 py-8 text-center sm:px-10">
        <p className="text-xs uppercase tracking-[0.4em] text-neon-lime">
          Resultat
        </p>
        <h2 className="mt-4 text-3xl font-semibold text-white">
          Humanite : 70%
        </h2>
        <p className="mt-4 text-sm text-slate-200">
          Le protocole est stabilise. Tu peux acceder a Kaxon Rouge.
        </p>
        {unlocked ? (
          <div className="mt-6">
            <NeonButton href="/kaxon-rouge" className="sm:w-auto">
              Acces valide
            </NeonButton>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-between gap-4 text-center">
      <div className="text-[clamp(10px,1.1vw,16px)] uppercase tracking-[0.5em] text-neon-cyan/80">
        Question {activeIndex + 1} / {QUESTIONS.length}
      </div>
      <div className="text-[clamp(9px,0.9vw,13px)] uppercase tracking-[0.4em] text-neon-cyan/50">
        Regles : 10 dilemmes - 20s - Humanite 70%
      </div>
      <div
        className={`tron-font flex items-center justify-center rounded-full border-4 border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan shadow-[0_0_40px_rgba(45,250,255,0.7)] animate-pulseGlow ${
          isLedMode
            ? "h-[clamp(6.5rem,18vh,13.5rem)] w-[clamp(6.5rem,18vh,13.5rem)]"
            : "h-[clamp(4.8rem,14vh,8.5rem)] w-[clamp(4.8rem,14vh,8.5rem)]"
        } ${isUrgent ? "urgent-timer" : ""}`}
      >
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
        className={`mx-auto max-w-5xl font-semibold leading-[1.2] text-white normal-case transition duration-300 hover:text-neon-cyan ${
          isLedMode
            ? "text-[clamp(1.8rem,4.6vw,4.2rem)]"
            : "text-[clamp(1.3rem,3.6vw,2.8rem)]"
        }`}
      >
        {currentQuestion.title}
      </h2>
      <div className="grid w-full max-w-5xl gap-3">
        {currentQuestion.choices.map((choice, index) => {
          const label = String.fromCharCode(65 + index);
          const isSelected = selectedChoice === label;
          const shouldPulse = isSelected && pulseIndex === activeIndex;
          return (
            <NeonButton
              key={choice}
              onClick={() => handleAnswer(label, activeIndex)}
              disabled={isTransitioning || !!selectedChoice}
              className={`min-h-[clamp(50px,7.5vh,80px)] items-center justify-between gap-6 rounded-3xl border-2 px-6 py-5 text-left tracking-normal transition duration-300 hover:-translate-y-0.5 hover:bg-neon-cyan/10 hover:border-neon-cyan hover:shadow-neon ${
                isLedMode
                  ? "text-[clamp(1.25rem,3vw,2.8rem)]"
                  : "text-[clamp(1rem,2.2vw,1.9rem)]"
              } ${
                isSelected
                  ? "border-neon-lime/70 text-neon-lime"
                  : "border-neon-cyan/60 text-white"
              } ${
                shouldPulse
                  ? "animate-[pulseGlow_0.35s_ease-in-out_1] shadow-[0_0_24px_rgba(183,255,42,0.9)]"
                  : ""
              } normal-case`}
            >
              <span className="text-[clamp(0.85rem,1.8vw,2.2rem)] font-semibold uppercase tracking-[0.5em] text-neon-cyan/90">
                {label}
              </span>
              <span className="flex-1">{choice}</span>
            </NeonButton>
          );
        })}
      </div>
      <div className="w-full max-w-5xl">
        <HumanityBar value={humanity} isLedMode={isLedMode} />
      </div>
    </div>
  );
}




