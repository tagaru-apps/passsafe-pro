import { describe, expect, it } from "vitest";

import { scheduleCooldownCompleteNotification } from "@/lib/cooldown-notifications.web";

describe("cooldown notification fallback", () => {
  it("does not attempt to schedule native cooldown alerts on web", async () => {
    await expect(scheduleCooldownCompleteNotification()).resolves.toBe(false);
  });
});
