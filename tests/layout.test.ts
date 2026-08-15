import { describe, expect, it } from "vitest";

import { APP_CONTENT_MAX_WIDTH, getBottomTabMetrics, getPageHorizontalPadding, getTopContentInset, isCompactDevice } from "@/lib/layout";

describe("PassSafe responsive layout rules", () => {
  it("keeps the application frame at a mobile-readable width on wide displays", () => {
    expect(APP_CONTENT_MAX_WIDTH).toBe(520);
  });

  it("reduces gutters only for the narrowest supported portrait screens", () => {
    expect(getPageHorizontalPadding(320)).toBe(16);
    expect(getPageHorizontalPadding(390)).toBe(20);
    expect(getPageHorizontalPadding(768)).toBe(28);
  });

  it("identifies compact portrait emulators for reduced vertical spacing", () => {
    expect(isCompactDevice(320, 568)).toBe(true);
    expect(isCompactDevice(390, 844)).toBe(false);
  });

  it("preserves a device cutout inset and adds a minimum clear zone when none is reported", () => {
    expect(getTopContentInset(59)).toBe(59);
    expect(getTopContentInset(0)).toBe(18);
  });

  it("fits a compact Android portrait profile with a camera cutout and gesture bar", () => {
    expect(isCompactDevice(360, 640)).toBe(true);
    expect(getTopContentInset(24)).toBe(24);
    expect(getBottomTabMetrics(24, false)).toEqual({ bottomPadding: 24, height: 80 });
  });

  it("fits a standard Android portrait profile without reducing essential spacing", () => {
    expect(isCompactDevice(412, 915)).toBe(false);
    expect(getTopContentInset(32)).toBe(32);
    expect(getBottomTabMetrics(16, false)).toEqual({ bottomPadding: 16, height: 72 });
  });
});
