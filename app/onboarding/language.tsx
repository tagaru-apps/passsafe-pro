import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { PrimaryButton, colors } from "@/components/passsafe-ui";
import { ScreenContainer } from "@/components/screen-container";
import { usePassSafe } from "@/lib/passsafe-context";
import { languages, type AppLanguage } from "@/lib/passsafe-data";
import { haptic } from "@/lib/haptics";
import { useCompactScreen } from "@/hooks/use-compact-screen";

export default function LanguageScreen() {
  const router = useRouter();
  const { language, changeLanguage } = usePassSafe();
  const { isCompact } = useCompactScreen();
  const [selected, setSelected] = useState<AppLanguage>(language);
  const continueFlow = async () => { await changeLanguage(selected); router.push("/onboarding/exam" as never); };
  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.scroll, isCompact && styles.scrollCompact]} showsVerticalScrollIndicator={false}>
        <View style={[styles.mark, isCompact && styles.markCompact]}><MaterialIcons name="security" size={23} color="#FFFFFF" /></View>
        <Text style={[styles.title, isCompact && styles.titleCompact]}>Choose your language</Text>
        <Text style={styles.subtitle}>Your practice content and interface will update instantly.</Text>
        <View style={[styles.options, isCompact && styles.optionsCompact]}>{languages.map((item) => {
          const active = selected === item.key;
          return <Pressable key={item.key} onPress={() => { haptic.selection(); setSelected(item.key); }} style={({ pressed }) => [styles.option, isCompact && styles.optionCompact, active && styles.optionActive, pressed && styles.pressed]}>
            <View style={styles.flag}><Text style={styles.flagText}>{item.flag}</Text></View>
            <View style={styles.optionCopy}><Text style={styles.optionTitle}>{item.label}</Text><Text style={styles.optionNative}>{item.native}</Text></View>
            <View style={[styles.radio, active && styles.radioActive]}>{active ? <MaterialIcons name="check" size={16} color="#FFFFFF" /> : null}</View>
          </Pressable>;
        })}</View>
      </ScrollView>
      <View style={[styles.footer, isCompact && styles.footerCompact]}><PrimaryButton label="Continue" onPress={continueFlow} /><Text style={styles.step}>PASSSAFE ONBOARDING · STEP 1 OF 2</Text></View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, paddingHorizontal: 24 }, scroll: { paddingTop: 14, paddingBottom: 24 }, scrollCompact: { paddingTop: 6, paddingBottom: 12 }, mark: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", alignSelf: "center", marginTop: 4, marginBottom: 18 }, markCompact: { width: 40, height: 40, borderRadius: 14, marginBottom: 10 }, title: { fontSize: 28, fontWeight: "800", color: colors.primary, textAlign: "center" }, titleCompact: { fontSize: 24 }, subtitle: { fontSize: 14, color: colors.textSecondary, textAlign: "center", lineHeight: 20, marginTop: 8, paddingHorizontal: 22 }, options: { marginTop: 30, gap: 12 }, optionsCompact: { marginTop: 17, gap: 8 }, option: { height: 72, borderRadius: 14, backgroundColor: "#FFFFFF", borderWidth: 2, borderColor: "transparent", paddingHorizontal: 15, flexDirection: "row", alignItems: "center", gap: 13, shadowColor: "#111827", shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 2 }, optionCompact: { height: 60, paddingHorizontal: 13 }, optionActive: { borderColor: colors.primary, backgroundColor: "#F0FDF4" }, flag: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center" }, flagText: { fontSize: 21 }, optionCopy: { flex: 1 }, optionTitle: { color: colors.text, fontSize: 16, fontWeight: "700" }, optionNative: { color: colors.textSecondary, fontSize: 13, marginTop: 2 }, radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border, alignItems: "center", justifyContent: "center" }, radioActive: { backgroundColor: colors.primary, borderColor: colors.primary }, footer: { paddingVertical: 14, gap: 12 }, footerCompact: { paddingVertical: 8, gap: 7 }, step: { textAlign: "center", color: "#9CA3AF", fontSize: 10, fontWeight: "700", letterSpacing: 1.3 }, pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
});
