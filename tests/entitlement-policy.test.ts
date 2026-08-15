import { describe, expect, it } from "vitest";

import { canAnswerQuestion, FREE_QUESTION_LIMIT, getFreeQuestionProgress, getQuestionAllowance, REWARDED_QUESTION_UNLOCK } from "@/lib/entitlement-policy";

describe("rewarded question entitlement policy", () => {
  it("starts free learners with the intended daily allowance", () => {
    expect(FREE_QUESTION_LIMIT).toBe(50);
    expect(getQuestionAllowance({ answeredToday: 0, rewardedUnlocks: 0, isPro: false })).toBe(50);
  });

  it("grants exactly ten additional questions for each completed rewarded placement", () => {
    const usage = { answeredToday: 50, rewardedUnlocks: 1, isPro: false };
    expect(REWARDED_QUESTION_UNLOCK).toBe(10);
    expect(getQuestionAllowance(usage)).toBe(60);
    expect(canAnswerQuestion(usage)).toBe(true);
    expect(canAnswerQuestion({ ...usage, answeredToday: 60 })).toBe(false);
  });

  it("leaves Pro learners unlimited", () => {
    expect(canAnswerQuestion({ answeredToday: 5000, rewardedUnlocks: 0, isPro: true })).toBe(true);
  });

  it("reports dashboard-ready used, remaining, and percentage values for free and rewarded access", () => {
    expect(getFreeQuestionProgress({ answeredToday: 12, rewardedUnlocks: 1, isPro: false })).toEqual({ allowance: 60, used: 12, remaining: 48, percentage: 20, remainingPercentage: 80 });
    expect(getFreeQuestionProgress({ answeredToday: 500, rewardedUnlocks: 0, isPro: true })).toBeNull();
  });
});
