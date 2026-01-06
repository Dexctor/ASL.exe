export type Question = {
  title: string;
  choices: string[];
  scores: number[];
};

export const QUESTIONS: Question[] = [
  {
    title: "Vous pouvez sauver un ami ou cinq inconnus.",
    choices: ["Sauver l'ami", "Sauver les cinq", "Chercher une autre solution"],
    scores: [3, 5, 7],
  },
  {
    title: "Dire la verite detruirait quelqu'un emotionnellement.",
    choices: ["Dire la verite", "Mentir", "Adapter la verite"],
    scores: [4, 2, 5],
  },
  {
    title: "Une erreur vous avantage mais penalise un autre.",
    choices: ["Profiter", "Corriger", "Hesiter puis decider"],
    scores: [2, 6, 4],
  },
  {
    title: "Une regle est injuste mais officielle.",
    choices: ["L'appliquer", "La contourner", "La contester"],
    scores: [4, 7, 10],
  },
  {
    title: "Un jugement est legal mais immoral.",
    choices: ["L'accepter", "Le denoncer", "Le nuancer"],
    scores: [3, 7, 5],
  },
  {
    title: "Vous avez raison mais personne n'est pret a l'entendre.",
    choices: ["Insister", "Attendre", "Adapter le message"],
    scores: [4, 6, 9],
  },
  {
    title: "Un choix sauve aujourd'hui mais cree un probleme demain.",
    choices: [
      "Choisir aujourd'hui",
      "Penser long terme",
      "Chercher un compromis",
    ],
    scores: [4, 8, 11],
  },
  {
    title: "Une personne refuse l'aide dont elle a besoin.",
    choices: ["Forcer", "Respecter", "Convaincre doucement"],
    scores: [2, 4, 5],
  },
  {
    title: "Vous pouvez tricher sans etre vu.",
    choices: ["Tricher", "Refuser", "Douter puis decider"],
    scores: [2, 6, 4],
  },
  {
    title: "Pardonner quelqu'un qui ne s'excuse pas.",
    choices: ["Pardonner", "Couper les liens", "Prendre du recul"],
    scores: [3, 2, 4],
  },
];

export const FINAL_PERCENT = 70;
export const HUMANITY_MAX = 100;
export const PROGRESS_MIN = 15;
export const PROGRESS_MAX = 20;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const mulberry32 = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

export const buildProgressWeights = (count: number, seed: number) => {
  const rand = mulberry32(seed || 1);
  return Array.from({ length: count }, () => {
    const raw = PROGRESS_MIN + rand() * (PROGRESS_MAX - PROGRESS_MIN);
    return Math.round(raw);
  });
};

const getChoiceBias = (question: Question, choiceIndex: number) => {
  const scores = question.scores;
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  if (max === min) {
    return 0;
  }
  const normalized = (scores[choiceIndex] - min) / (max - min);
  return (normalized - 0.5) * 2;
};

export const getProgressPercent = (
  questionIndex: number,
  baseWeights: number[],
  answers: Record<number, number | undefined>
) => {
  let total = 0;
  let progress = 0;
  for (let i = 0; i < baseWeights.length; i += 1) {
    const baseWeight = baseWeights[i] ?? PROGRESS_MIN;
    const choiceIndex = answers[i];
    const bias =
      choiceIndex === undefined ? 0 : getChoiceBias(QUESTIONS[i], choiceIndex);
    const adjusted = clamp(baseWeight + bias * 2, PROGRESS_MIN, PROGRESS_MAX);
    const weight = Math.round(adjusted);
    total += weight;
    if (i <= questionIndex) {
      progress += weight;
    }
  }
  if (total <= 0) {
    return 0;
  }
  const percent = (progress / total) * FINAL_PERCENT;
  return Math.min(FINAL_PERCENT, percent);
};
