import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/components/passsafe-ui";
import { APP_CONTENT_MAX_WIDTH } from "@/components/screen-container";
import { usePassSafe } from "@/lib/passsafe-context";
import { getBottomTabMetrics } from "@/lib/layout";

const iconByRoute = { index: "home", study: "menu-book", progress: "assessment", profile: "person" } as const;

export default function TabLayout() {
  const { t } = usePassSafe();
  const insets = useSafeAreaInsets();
  const { bottomPadding, height: tabBarHeight } = getBottomTabMetrics(insets.bottom, Platform.OS === "web");
  return (
    <Tabs screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: "#9CA3AF",
      tabBarStyle: { backgroundColor: "#FFFFFF", borderTopColor: colors.border, height: tabBarHeight, paddingTop: 7, paddingBottom: bottomPadding, width: "100%", maxWidth: APP_CONTENT_MAX_WIDTH, alignSelf: "center" },
      tabBarLabelStyle: { fontSize: 10, fontWeight: "700" },
      tabBarIcon: ({ color, size }) => <MaterialIcons name={iconByRoute[route.name as keyof typeof iconByRoute]} color={color} size={size} />,
    })}>
      <Tabs.Screen name="index" options={{ title: t("home") }} />
      <Tabs.Screen name="study" options={{ title: t("study") }} />
      <Tabs.Screen name="progress" options={{ title: t("progress") }} />
      <Tabs.Screen name="profile" options={{ title: t("profile") }} />
    </Tabs>
  );
}
