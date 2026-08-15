import { describe, expect, it } from "vitest";

import { APP_CONTENT_MAX_WIDTH, getPageHorizontalPadding, isCompactDevice } from "@/lib/layout";

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
});
