import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { PassSafeProvider } from "@/lib/passsafe-context";
import { initializeCooldownNotifications, subscribeToCooldownNotificationLinks } from "@/lib/cooldown-notifications";
import { initializeMobileAds } from "@/lib/mobile-ads";

export default function RootLayout() {
  const router = useRouter();
  useEffect(() => {
    initializeMobileAds().catch(() => undefined);
    initializeCooldownNotifications().catch(() => undefined);
  }, []);
  useEffect(() => subscribeToCooldownNotificationLinks((url) => router.push(url as never)), [router]);

  return (
    <SafeAreaProvider>
      <PassSafeProvider>
        <StatusBar style="dark" translucent backgroundColor="transparent" />
        <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding/language" />
          <Stack.Screen name="onboarding/exam" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="topic" options={{ animation: "slide_from_right" }} />
          <Stack.Screen name="session" options={{ animation: "slide_from_bottom" }} />
          <Stack.Screen name="result" options={{ animation: "fade" }} />
          <Stack.Screen name="pro" options={{ animation: "slide_from_bottom" }} />
          <Stack.Screen name="subscription" options={{ animation: "slide_from_right" }} />
        </Stack>
      </PassSafeProvider>
    </SafeAreaProvider>
  );
}
