import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { Card, PrimaryButton, colors } from "@/components/passsafe-ui";
import { ScreenContainer } from "@/components/screen-container";
import { usePassSafe } from "@/lib/passsafe-context";
import { useCompactScreen } from "@/hooks/use-compact-screen";

export default function WelcomeScreen() {
  const router = useRouter();
  const { hydrated, hasCompletedOnboarding } = usePassSafe();
  const { isCompact } = useCompactScreen();

  useEffect(() => {
    if (hydrated && hasCompletedOnboarding) router.replace("/(tabs)");
  }, [hydrated, hasCompletedOnboarding, router]);

  if (!hydrated || hasCompletedOnboarding) {
    return <ScreenContainer style={styles.loading}><ActivityIndicator color={colors.primary} size="large" /></ScreenContainer>;
  }

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} className="px-6" style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.scrollContent, isCompact && styles.scrollContentCompact]} showsVerticalScrollIndicator={false} bounces={false}>
        <View style={[styles.content, isCompact && styles.contentCompact]}>
          <View style={[styles.hero, isCompact && styles.heroCompact]}>
          <View style={styles.logo}><MaterialIcons name="security" size={36} color="#FFFFFF" /><Text style={styles.logoFork}>♜</Text><View style={styles.logoDot} /></View>
          <Text style={styles.brand}>PassSafe</Text>
          <Text style={styles.title}>Food safety confidence, built one question at a time.</Text>
          <Text style={styles.subtitle}>Study smarter. Pass first try.</Text>
        </View>
        <Card style={[styles.promiseCard, isCompact && styles.promiseCardCompact]}>
          <View style={styles.promiseIcon}><MaterialIcons name="verified-user" size={24} color={colors.primary} /></View>
          <View style={styles.promiseCopy}><Text style={styles.promiseTitle}>Pass with practical mastery</Text><Text style={styles.promiseText}>Multilingual practice, FDA-based explanations, and a focused plan for your exam day.</Text></View>
        </Card>
        </View>
        <View style={styles.footer}>
        <PrimaryButton label="Continue with Google" icon="g-translate" onPress={() => router.push("/onboarding/language" as never)} />
        <Text style={styles.terms}>By continuing, you agree to learn with original PassSafe practice content.</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loading: { alignItems: "center", justifyContent: "center" },
  screen: { backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, justifyContent: "space-between", paddingTop: 28, paddingBottom: 14 },
  scrollContentCompact: { paddingTop: 12, paddingBottom: 8 },
  content: { flex: 1, justifyContent: "center", gap: 30 },
  contentCompact: { gap: 20 },
  hero: { alignItems: "center", paddingHorizontal: 10 },
  heroCompact: { paddingTop: 4 },
  logo: { width: 76, height: 76, borderRadius: 24, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", marginBottom: 18, shadowColor: colors.primary, shadowOpacity: 0.24, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
  logoFork: { position: "absolute", color: "#FFFFFF", fontSize: 17, right: 15, bottom: 15, transform: [{ rotate: "45deg" }] },
  logoDot: { position: "absolute", width: 13, height: 13, borderRadius: 7, backgroundColor: colors.accent, top: -2, right: -2, borderWidth: 2, borderColor: colors.background },
  brand: { fontSize: 28, fontWeight: "800", color: colors.primary, letterSpacing: -0.8 },
  title: { color: colors.text, fontSize: 27, lineHeight: 34, fontWeight: "800", textAlign: "center", marginTop: 18 },
  subtitle: { fontSize: 15, color: colors.textSecondary, textAlign: "center", marginTop: 12 },
  promiseCard: { flexDirection: "row", padding: 18, gap: 14 },
  promiseCardCompact: { padding: 15 },
  promiseIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: "#F0FDF4", alignItems: "center", justifyContent: "center" },
  promiseCopy: { flex: 1, gap: 4 },
  promiseTitle: { color: colors.text, fontSize: 15, fontWeight: "800" },
  promiseText: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
  footer: { gap: 14, paddingBottom: 6 },
  terms: { textAlign: "center", color: "#9CA3AF", fontSize: 11, lineHeight: 16, paddingHorizontal: 18 },
});
