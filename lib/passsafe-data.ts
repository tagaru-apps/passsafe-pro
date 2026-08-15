export type AppLanguage = "en" | "es" | "zh" | "ko";
export type CertTrack = "manager" | "handler" | "alcohol" | "allergens";

export type LocalizedQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tip: string;
};

import bundledQuestions from "@/assets/data/questions.json";

export type ExamQuestion = {
  id: string;
  topic: string;
  track: Array<"manager" | "handler">;
  difficulty: "easy" | "medium" | "hard";
  isHighYield: boolean;
  language: Record<AppLanguage, LocalizedQuestion>;
  regulationRef: string;
};

export const questionBank = bundledQuestions as ExamQuestion[];

export const languages: Array<{ key: AppLanguage; label: string; native: string; flag: string }> = [
  { key: "en", label: "English", native: "English", flag: "🇺🇸" },
  { key: "es", label: "Español", native: "Spanish", flag: "🇲🇽" },
  { key: "zh", label: "中文", native: "Chinese", flag: "🇨🇳" },
  { key: "ko", label: "한국어", native: "Korean", flag: "🇰🇷" },
];

export const tracks: Array<{ key: CertTrack; title: string; subtitle: string; icon: string; featured?: boolean }> = [
  { key: "manager", title: "Manager", subtitle: "Full Certification", icon: "🏆", featured: true },
  { key: "handler", title: "Food Handler", subtitle: "Basic Safety", icon: "🍽️" },
  { key: "alcohol", title: "Alcohol", subtitle: "Responsible Prep", icon: "🥂" },
  { key: "allergens", title: "Allergens", subtitle: "Critical Care", icon: "⚠️" },
];

export const uiCopy: Record<AppLanguage, Record<string, string>> = {
  en: {
    goodMorning: "Good morning",
    readinessScore: "Readiness Score",
    todayQuestions: "Today's 10 Questions",
    studyModes: "Study Modes",
    progress: "Progress",
    profile: "Profile",
    home: "Home",
    study: "Study",
    questions: "questions",
    focusAreas: "Focus Areas",
    drillNow: "Drill now",
    continue: "Continue",
    correct: "Correct",
    incorrect: "Incorrect",
  },
  es: {
    goodMorning: "Buenos días",
    readinessScore: "Puntuación de preparación",
    todayQuestions: "Las 10 preguntas de hoy",
    studyModes: "Modos de estudio",
    progress: "Progreso",
    profile: "Perfil",
    home: "Inicio",
    study: "Estudiar",
    questions: "preguntas",
    focusAreas: "Áreas de enfoque",
    drillNow: "Practicar ahora",
    continue: "Continuar",
    correct: "Correcto",
    incorrect: "Incorrecto",
  },
  zh: {
    goodMorning: "早上好",
    readinessScore: "准备度评分",
    todayQuestions: "今日 10 题",
    studyModes: "学习模式",
    progress: "进度",
    profile: "个人资料",
    home: "首页",
    study: "学习",
    questions: "题",
    focusAreas: "重点领域",
    drillNow: "立即练习",
    continue: "继续",
    correct: "正确",
    incorrect: "错误",
  },
  ko: {
    goodMorning: "좋은 아침이에요",
    readinessScore: "준비도 점수",
    todayQuestions: "오늘의 10문제",
    studyModes: "학습 모드",
    progress: "진행 상황",
    profile: "프로필",
    home: "홈",
    study: "학습",
    questions: "문제",
    focusAreas: "집중 영역",
    drillNow: "지금 학습",
    continue: "계속",
    correct: "정답",
    incorrect: "오답",
  },
};

export function getLocalizedQuestion(question: ExamQuestion, language: AppLanguage): LocalizedQuestion {
  return question.language[language] ?? question.language.en;
}

export function filteredQuestions(track: CertTrack, topic?: string): ExamQuestion[] {
  const dataTrack = track === "manager" ? "manager" : "handler";
  return questionBank.filter((question) => question.track.includes(dataTrack) && (!topic || question.topic === topic));
}

export function getQuestionTopics(track: CertTrack): Array<{ topic: string; count: number }> {
  const countByTopic = filteredQuestions(track).reduce<Record<string, number>>((accumulator, question) => {
    accumulator[question.topic] = (accumulator[question.topic] ?? 0) + 1;
    return accumulator;
  }, {});
  return Object.entries(countByTopic)
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count);
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}
