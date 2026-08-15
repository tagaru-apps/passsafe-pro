import { describe, expect, it } from "vitest";

import { admobTestUnits, resolveAdUnit } from "@/lib/ad-config";

describe("AdMob configuration", () => {
  it("uses Google test units during development", () => {
    expect(resolveAdUnit("banner", true)).toBe(admobTestUnits.banner);
    expect(resolveAdUnit("interstitial", true)).toBe(admobTestUnits.interstitial);
    expect(resolveAdUnit("rewarded", true)).toBe(admobTestUnits.rewarded);
  });

  it("keeps ad unit identifiers in the expected Google Mobile Ads format", () => {
    expect(admobTestUnits.banner).toMatch(/^ca-app-pub-\d+\/\d+$/);
    expect(admobTestUnits.interstitial).toMatch(/^ca-app-pub-\d+\/\d+$/);
    expect(admobTestUnits.rewarded).toMatch(/^ca-app-pub-\d+\/\d+$/);
  });
});
