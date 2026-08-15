import { describe, expect, it } from "vitest";

describe("RevenueCat platform configuration", () => {
  it("has platform-specific public SDK keys available for native purchase initialization", () => {
    const iosKey = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY;
    const androidKey = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;

    expect(iosKey).toMatch(/^(appl_|test_)/);
    expect(androidKey).toMatch(/^(goog_|test_)/);
  });
});
