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
    title: "Dire la vérité détruirait quelqu'un émotionnellement.",
    choices: ["Dire la vérité", "Mentir", "Adapter la vérité"],
    scores: [4, 2, 5],
  },
  {
    title: "Une erreur vous avantage mais pénalise un autre.",
    choices: ["Profiter", "Corriger", "Hésiter puis décider"],
    scores: [2, 6, 4],
  },
  {
    title: "Une règle est injuste mais officielle.",
    choices: ["L'appliquer", "La contourner", "La contester"],
    scores: [4, 7, 10],
  },
  {
    title: "Un jugement est légal mais immoral.",
    choices: ["L'accepter", "Le dénoncer", "Le nuancer"],
    scores: [3, 7, 5],
  },
  {
    title: "Vous avez raison mais personne n'est prêt à l'entendre.",
    choices: ["Insister", "Attendre", "Adapter le message"],
    scores: [4, 6, 9],
  },
  {
    title: "Un choix sauve aujourd'hui mais crée un problème demain.",
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
    title: "Vous pouvez tricher sans être vu.",
    choices: ["Tricher", "Refuser", "Douter puis décider"],
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
// Each answer advances by 15-20 points, normalized to finish at FINAL_PERCENT.
const PROGRESS_PATTERN = [16, 18, 15, 19, 17, 20];
const PROGRESS_WEIGHTS = QUESTIONS.map(
  (_, index) => PROGRESS_PATTERN[index % PROGRESS_PATTERN.length]
);
const PROGRESS_TOTAL = PROGRESS_WEIGHTS.reduce(
  (total, weight) => total + weight,
  0
);
const PROGRESS_CUMULATIVE = PROGRESS_WEIGHTS.reduce<number[]>(
  (acc, weight, index) => {
    const previous = index === 0 ? 0 : acc[index - 1];
    acc.push(previous + weight);
    return acc;
  },
  []
);

export const getProgressPercent = (questionIndex: number) => {
  const progressPoints = PROGRESS_CUMULATIVE[questionIndex] ?? 0;
  const percent = (progressPoints / PROGRESS_TOTAL) * FINAL_PERCENT;
  return Math.min(FINAL_PERCENT, percent);
};
