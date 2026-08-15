export type RewardEvent = { date: string; questions: number };

function mondayFor(date: Date): string {
  const value = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  value.setUTCDate(value.getUTCDate() - ((value.getUTCDay() + 6) % 7));
  return value.toISOString().slice(0, 10);
}

export function getWeeklyRewardSummary(events: RewardEvent[], today = new Date()) {
  const weekStart = mondayFor(today);
  const currentWeek = events.filter((event) => event.date >= weekStart && event.date <= today.toISOString().slice(0, 10));
  return { questions: currentWeek.reduce((total, event) => total + event.questions, 0), unlocks: currentWeek.length, weekStart };
}
