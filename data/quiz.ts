export type Question = {
  title: string;
  choices: string[];
  scores: number[];
};

export const QUESTIONS: Question[] = [
  {
    title: "Comment s'appelle la directrice animation ?",
    choices: ["Elodie", "Manon", "Sarah"],
    scores: [5, 3, 4],
  },
  {
    title: "Qui a cree la choree d'ouverture ?",
    choices: ["Louison", "Redouane", "Coco"],
    scores: [6, 7, 4],
  },
  {
    title: "Combien de questions a comporte la soiree de Noel ?",
    choices: ["10", "15", "Mateoo"],
    scores: [6, 4, 2],
  },
  {
    title: "Qui a cree la choree de fermeture ?",
    choices: ["Djawad", "Redouane", "Louison"],
    scores: [5, 7, 6],
  },
  {
    title: "Comment s'appelle le directeur de Klaxon Rouge ?",
    choices: ["Regis", "Regelegorilla", "Galdric"],
    scores: [7, 3, 5],
  },
  {
    title: "Peche ou Cerise ?",
    choices: ["Peche", "Cerise", "J'adore les fruits"],
    scores: [5, 5, 7],
  },
  {
    title: "Quelle est la meilleure ecole d'animation ?",
    choices: ["Klaxon Rouge", "Klaxon Rouge", "Klaxon Rouge"],
    scores: [6, 6, 6],
  },
  {
    title: "Les ASL vous etes Chaud ?",
    choices: ["Oui", "Ouiiiii", "Ouiiiiiii"],
    scores: [5, 6, 7],
  },
  {
    title: "Gald, on a toujours pas nos remboursement Esker",
    choices: ["On relance", "On attend", "On oublie"],
    scores: [6, 4, 2],
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
