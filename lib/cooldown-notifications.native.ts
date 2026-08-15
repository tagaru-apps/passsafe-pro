import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

let initialized = false;
let scheduledCooldownNotification: string | null = null;

export async function initializeCooldownNotifications() {
  if (initialized) return;
  Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldPlaySound: false, shouldSetBadge: false, shouldShowBanner: true, shouldShowList: true }) });
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("reward-cooldowns", { name: "Reward availability", importance: Notifications.AndroidImportance.DEFAULT, vibrationPattern: [0, 120], lightColor: "#1B5E40" });
  }
  initialized = true;
}

export async function scheduleCooldownCompleteNotification() {
  await initializeCooldownNotifications();
  let status = (await Notifications.getPermissionsAsync()).status;
  if (status !== "granted") status = (await Notifications.requestPermissionsAsync()).status;
  if (status !== "granted") return false;
  if (scheduledCooldownNotification) await Notifications.cancelScheduledNotificationAsync(scheduledCooldownNotification).catch(() => undefined);
  scheduledCooldownNotification = await Notifications.scheduleNotificationAsync({
    content: { title: "Your reward is ready", body: "A new rewarded ad may be available. Unlock 10 more PassSafe questions.", data: { url: "/(tabs)" } },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 30, repeats: false, channelId: "reward-cooldowns" },
  });
  return true;
}
