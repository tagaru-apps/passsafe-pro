import { Platform } from "react-native";
import { initializeCooldownNotifications as initializeWebNotifications, scheduleCooldownCompleteNotification as scheduleWebCooldown } from "@/lib/cooldown-notifications.web";

type NativeModule = typeof import("@/lib/cooldown-notifications.native");

function nativeModule(): NativeModule | null {
  if (Platform.OS === "web") return null;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@/lib/cooldown-notifications.native") as NativeModule;
}

export async function initializeCooldownNotifications() {
  const native = nativeModule();
  return native ? native.initializeCooldownNotifications() : initializeWebNotifications();
}

export async function scheduleCooldownCompleteNotification() {
  const native = nativeModule();
  return native ? native.scheduleCooldownCompleteNotification() : scheduleWebCooldown();
}

export function subscribeToCooldownNotificationLinks(onRoute: (url: string) => void) {
  const native = nativeModule();
  return native ? native.subscribeToCooldownNotificationLinks(onRoute) : () => undefined;
}
