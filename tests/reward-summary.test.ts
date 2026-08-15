import { describe, expect, it } from "vitest";

import { getWeeklyRewardSummary, getWeeklyRewardTrend } from "@/lib/reward-summary";
import { formatOfferCountdown, getRemainingOfferSeconds, RECOVERY_OFFER_SECONDS } from "@/lib/pro-offer";

describe("reward recovery summaries", () => {
  it("counts only rewarded questions unlocked in the current Monday-starting week", () => {
    const summary = getWeeklyRewardSummary([
      { date: "2026-08-09", questions: 10 },
      { date: "2026-08-10", questions: 10 },
      { date: "2026-08-15", questions: 20 },
    ], new Date("2026-08-15T12:00:00Z"));
    expect(summary).toEqual({ questions: 30, unlocks: 2, weekStart: "2026-08-10" });
  });

  it("provides a finite recovery-offer countdown and readable timer", () => {
    expect(getRemainingOfferSeconds("2026-08-15T12:00:00.000Z", Date.parse("2026-08-15T12:05:00.000Z"))).toBe(RECOVERY_OFFER_SECONDS - 300);
    expect(formatOfferCountdown(605)).toBe("10:05");
  });

  it("builds seven daily unlock bins for the weekly reward chart", () => {
    const trend = getWeeklyRewardTrend([{ date: "2026-08-10", questions: 10 }, { date: "2026-08-12", questions: 20 }], new Date("2026-08-15T12:00:00Z"));
    expect(trend).toHaveLength(7);
    expect(trend.map((day) => day.questions)).toEqual([10, 0, 20, 0, 0, 0, 0]);
  });
});
