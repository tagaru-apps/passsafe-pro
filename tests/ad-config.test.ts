import { describe, expect, it } from "vitest";

import { admobTestUnits, resolveAdUnit } from "@/lib/ad-config";

describe("AdMob configuration", () => {
  it("uses Google test units during development", () => {
    expect(resolveAdUnit("banner", true)).toBe(admobTestUnits.banner);
    expect(resolveAdUnit("interstitial", true)).toBe(admobTestUnits.interstitial);
  });

  it("keeps ad unit identifiers in the expected Google Mobile Ads format", () => {
    expect(admobTestUnits.banner).toMatch(/^ca-app-pub-\d+\/\d+$/);
    expect(admobTestUnits.interstitial).toMatch(/^ca-app-pub-\d+\/\d+$/);
  });
});
