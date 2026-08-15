import { describe, expect, it } from "vitest";

import { canAnswerQuestion, FREE_QUESTION_LIMIT, getQuestionAllowance, REWARDED_QUESTION_UNLOCK } from "@/lib/entitlement-policy";

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
});
