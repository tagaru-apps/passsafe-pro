import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

import { type AppLanguage, type CertTrack, uiCopy } from "@/lib/passsafe-data";

type TopicProgress = Record<string, { total: number; correct: number }>;
type Usage = { date: string; answeredToday: number; rewardedUnlocks: number; isPro: boolean; proSince: string | null };

type PassSafeContextValue = {
  hydrated: boolean;
  language: AppLanguage;
  certTrack: CertTrack;
  examDate: string;
  hasCompletedOnboarding: boolean;
  notificationsEnabled: boolean;
  progress: TopicProgress;
  usage: Usage;
  readiness: number;
  t: (key: string) => string;
  changeLanguage: (language: AppLanguage) => Promise<void>;
  saveSetup: (track: CertTrack, date: string) => Promise<void>;
  recordAnswer: (topic: string, isCorrect: boolean) => Promise<void>;
  canAnswer: () => boolean;
  incrementUsage: () => Promise<void>;
  unlockRewarded: () => Promise<void>;
  setPro: (value: boolean) => Promise<void>;
  setNotificationsEnabled: (value: boolean) => Promise<void>;
  resetLearner: () => Promise<void>;
};

const keys = {
  preferences: "passsafe_preferences",
  progress: "passsafe_progress",
  usage: "passsafe_usage_demo",
};

const todayString = () => new Date().toISOString().slice(0, 10);
const defaultUsage = (): Usage => ({ date: todayString(), answeredToday: 0, rewardedUnlocks: 0, isPro: false, proSince: null });
const defaultPreferences = { language: "en" as AppLanguage, certTrack: "manager" as CertTrack, examDate: "", hasCompletedOnboarding: false, notificationsEnabled: false };

const PassSafeContext = createContext<PassSafeContextValue | null>(null);

export function PassSafeProvider({ children }: PropsWithChildren) {
  const [hydrated, setHydrated] = useState(false);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [progress, setProgress] = useState<TopicProgress>({});
  const [usage, setUsage] = useState<Usage>(defaultUsage());

  useEffect(() => {
    const hydrate = async () => {
      const [storedPreferences, storedProgress, storedUsage] = await Promise.all([
        AsyncStorage.getItem(keys.preferences),
        AsyncStorage.getItem(keys.progress),
        AsyncStorage.getItem(keys.usage),
      ]);
      if (storedPreferences) setPreferences({ ...defaultPreferences, ...JSON.parse(storedPreferences) });
      if (storedProgress) setProgress(JSON.parse(storedProgress));
      if (storedUsage) {
        const parsed = JSON.parse(storedUsage) as Usage;
        setUsage(parsed.date === todayString() ? parsed : { ...parsed, date: todayString(), answeredToday: 0, rewardedUnlocks: 0 });
      }
      setHydrated(true);
    };
    hydrate().catch(() => setHydrated(true));
  }, []);

  const persistPreferences = async (next: typeof preferences) => {
    setPreferences(next);
    await AsyncStorage.setItem(keys.preferences, JSON.stringify(next));
  };

  const persistUsage = async (next: Usage) => {
    setUsage(next);
    await AsyncStorage.setItem(keys.usage, JSON.stringify(next));
  };

  const readiness = useMemo(() => {
    const entries = Object.values(progress).filter((item) => item.total > 0);
    if (entries.length === 0) return 0;
    return Math.round((entries.reduce((sum, item) => sum + item.correct / item.total, 0) / entries.length) * 100);
  }, [progress]);

  const value = useMemo<PassSafeContextValue>(() => ({
    hydrated,
    language: preferences.language,
    certTrack: preferences.certTrack,
    examDate: preferences.examDate,
    hasCompletedOnboarding: preferences.hasCompletedOnboarding,
    notificationsEnabled: preferences.notificationsEnabled,
    progress,
    usage,
    readiness,
    t: (key) => uiCopy[preferences.language][key] ?? uiCopy.en[key] ?? key,
    changeLanguage: async (language) => persistPreferences({ ...preferences, language }),
    saveSetup: async (certTrack, examDate) => persistPreferences({ ...preferences, certTrack, examDate, hasCompletedOnboarding: true }),
    recordAnswer: async (topic, isCorrect) => {
      const current = progress[topic] ?? { total: 0, correct: 0 };
      const next = { ...progress, [topic]: { total: current.total + 1, correct: current.correct + (isCorrect ? 1 : 0) } };
      setProgress(next);
      await AsyncStorage.setItem(keys.progress, JSON.stringify(next));
    },
    canAnswer: () => usage.isPro || usage.answeredToday < 50 + usage.rewardedUnlocks * 10,
    incrementUsage: async () => persistUsage({ ...usage, answeredToday: usage.answeredToday + 1 }),
    unlockRewarded: async () => persistUsage({ ...usage, rewardedUnlocks: usage.rewardedUnlocks + 1 }),
    setPro: async (value) => persistUsage({ ...usage, isPro: value, proSince: value ? new Date().toISOString() : null }),
    setNotificationsEnabled: async (notificationsEnabled) => persistPreferences({ ...preferences, notificationsEnabled }),
    resetLearner: async () => {
      await AsyncStorage.multiRemove([keys.preferences, keys.progress, keys.usage]);
      setPreferences(defaultPreferences);
      setProgress({});
      setUsage(defaultUsage());
    },
  }), [hydrated, preferences, progress, usage, readiness]);

  return <PassSafeContext.Provider value={value}>{children}</PassSafeContext.Provider>;
}

export function usePassSafe() {
  const context = useContext(PassSafeContext);
  if (!context) throw new Error("usePassSafe must be used within PassSafeProvider");
  return context;
}
