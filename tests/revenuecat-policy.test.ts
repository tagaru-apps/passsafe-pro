import { describe, expect, it } from "vitest";

import { isProEntitlementActive, PRO_ENTITLEMENT_ID } from "@/lib/revenuecat-policy";

describe("RevenueCat Pro entitlement policy", () => {
  it("recognizes only the configured Pro entitlement as active", () => {
    expect(PRO_ENTITLEMENT_ID).toBe("pro");
    expect(isProEntitlementActive({ pro: { expiresDate: "2027-01-01" } })).toBe(true);
    expect(isProEntitlementActive({ premium: {} })).toBe(false);
    expect(isProEntitlementActive(undefined)).toBe(false);
  });
});
