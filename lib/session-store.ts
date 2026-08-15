import { filteredQuestions, shuffle, type CertTrack, type ExamQuestion } from "@/lib/passsafe-data";

export type StudyMode = "quick" | "topic" | "mock" | "night";
export type StudySession = { id: string; mode: StudyMode; track: CertTrack; questions: ExamQuestion[]; topic?: string };

let activeSession: StudySession | null = null;

export function startSession(mode: StudyMode, track: CertTrack, topic?: string): StudySession {
  const pool = filteredQuestions(track, topic);
  const count = mode === "mock" ? 20 : mode === "night" ? 12 : 10;
  const questions = shuffle(pool).slice(0, Math.min(count, pool.length));
  activeSession = { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, mode, track, questions, topic };
  return activeSession;
}

export function getSession(id?: string): StudySession | null {
  return activeSession?.id === id ? activeSession : null;
}
