import { describe, expect, it } from "vitest";

import { DEFAULT_RECOVERY_OFFERING_ID, getRecoveryOfferingId, selectRecoveryPackages } from "@/lib/revenuecat-offer";

describe("RevenueCat recovery offering policy", () => {
  it("uses the designated recovery offering identifier when no build-time override is present", () => {
    expect(getRecoveryOfferingId()).toBe(DEFAULT_RECOVERY_OFFERING_ID);
  });

  it("selects promotional packages only during an active recovery offer", () => {
    expect(selectRecoveryPackages(["standard"], ["promo"], true)).toEqual(["promo"]);
    expect(selectRecoveryPackages(["standard"], ["promo"], false)).toEqual(["standard"]);
  });
});
