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

export function getWeeklyRewardTrend(events: RewardEvent[], today = new Date()) {
  const weekStart = new Date(`${mondayFor(today)}T00:00:00.000Z`);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setUTCDate(weekStart.getUTCDate() + index);
    const key = date.toISOString().slice(0, 10);
    return { date: key, label: date.toLocaleDateString("en-US", { weekday: "narrow", timeZone: "UTC" }), questions: events.filter((event) => event.date === key).reduce((sum, event) => sum + event.questions, 0) };
  });
}
