export const FREE_QUESTION_LIMIT = 50;
export const REWARDED_QUESTION_UNLOCK = 10;

export type EntitlementUsage = {
  answeredToday: number;
  rewardedUnlocks: number;
  isPro: boolean;
};

export function getQuestionAllowance(usage: EntitlementUsage): number {
  if (usage.isPro) return Number.POSITIVE_INFINITY;
  return FREE_QUESTION_LIMIT + usage.rewardedUnlocks * REWARDED_QUESTION_UNLOCK;
}

export function canAnswerQuestion(usage: EntitlementUsage): boolean {
  return usage.answeredToday < getQuestionAllowance(usage);
}

export function getFreeQuestionProgress(usage: EntitlementUsage) {
  const allowance = getQuestionAllowance(usage);
  if (!Number.isFinite(allowance)) return null;
  const used = Math.min(usage.answeredToday, allowance);
  return {
    allowance,
    used,
    remaining: Math.max(0, allowance - used),
    percentage: allowance === 0 ? 0 : Math.round((used / allowance) * 100),
    remainingPercentage: allowance === 0 ? 0 : Math.round((Math.max(0, allowance - used) / allowance) * 100),
  };
}
