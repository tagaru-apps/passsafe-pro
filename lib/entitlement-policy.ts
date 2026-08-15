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
