import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { PrimaryButton, Pill, colors } from "@/components/passsafe-ui";
import { ScreenContainer } from "@/components/screen-container";
import { usePassSafe } from "@/lib/passsafe-context";
import { tracks, type CertTrack } from "@/lib/passsafe-data";
import { haptic } from "@/lib/haptics";
import { useCompactScreen } from "@/hooks/use-compact-screen";

export default function ExamSetupScreen() {
  const router = useRouter();
  const { certTrack, examDate, saveSetup } = usePassSafe();
  const { isCompact } = useCompactScreen();
  const [selected, setSelected] = useState<CertTrack>(certTrack);
  const [date, setDate] = useState(examDate);
  const completeSetup = async () => { await saveSetup(selected, date); router.replace("/(tabs)"); };
  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.scroll, isCompact && styles.scrollCompact]} showsVerticalScrollIndicator={false}>
        <View style={[styles.topBar, isCompact && styles.topBarCompact]}><View style={styles.mark}><MaterialIcons name="security" size={18} color="#FFFFFF" /></View><Text style={styles.brand}>PassSafe</Text></View>
        <Text style={[styles.title, isCompact && styles.titleCompact]}>Which exam are you preparing for?</Text><Text style={styles.subtitle}>We’ll tailor your practice path to the certification you choose.</Text>
        <View style={[styles.grid, isCompact && styles.gridCompact]}>{tracks.map((track) => {
          const active = selected === track.key;
          return <Pressable key={track.key} onPress={() => { haptic.selection(); setSelected(track.key); }} style={({ pressed }) => [styles.track, isCompact && styles.trackCompact, active && styles.trackActive, pressed && styles.pressed]}>
            <View style={styles.trackIcon}><Text style={styles.trackEmoji}>{track.icon}</Text></View>
            {track.featured ? <Pill label="MOST POPULAR" tone="amber" /> : null}
            <Text style={styles.trackTitle}>{track.title}</Text><Text style={styles.trackSubtitle}>{track.subtitle}</Text>
            {active ? <View style={styles.trackCheck}><MaterialIcons name="check" size={13} color="#FFFFFF" /></View> : null}
          </Pressable>;
        })}</View>
        <Text style={[styles.dateLabel, isCompact && styles.dateLabelCompact]}>When is your exam?</Text>
        <View style={styles.inputWrap}><MaterialIcons name="event" size={20} color={colors.primary} /><TextInput placeholder="YYYY-MM-DD" placeholderTextColor="#9CA3AF" value={date} onChangeText={setDate} style={styles.input} keyboardType="numbers-and-punctuation" /></View>
        <Text style={styles.helper}>Optional — we’ll use this to set a practical daily goal.</Text>
      </ScrollView>
      <View style={[styles.footer, isCompact && styles.footerCompact]}><PrimaryButton label="Build My Study Plan" onPress={completeSetup} /></View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, paddingHorizontal: 24 }, scroll: { paddingTop: 12, paddingBottom: 22 }, scrollCompact: { paddingTop: 6, paddingBottom: 12 }, topBar: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 28 }, topBarCompact: { marginBottom: 15 }, mark: { width: 32, height: 32, borderRadius: 11, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }, brand: { color: colors.primary, fontSize: 17, fontWeight: "800" }, title: { color: colors.text, fontSize: 25, fontWeight: "800", lineHeight: 31 }, titleCompact: { fontSize: 22, lineHeight: 27 }, subtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 20, marginTop: 8 }, grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 25 }, gridCompact: { gap: 9, marginTop: 16 }, track: { width: "47.8%", minHeight: 166, backgroundColor: "#FFFFFF", borderRadius: 16, padding: 14, borderWidth: 2, borderColor: "transparent", position: "relative", shadowColor: "#111827", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 2 }, trackCompact: { minHeight: 135, padding: 11 }, trackActive: { borderColor: colors.primary, backgroundColor: "#F0FDF4" }, trackIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center", marginBottom: 11 }, trackEmoji: { fontSize: 22 }, trackTitle: { color: colors.text, fontSize: 14, fontWeight: "800", marginTop: 6 }, trackSubtitle: { color: colors.textSecondary, fontSize: 11, lineHeight: 15, marginTop: 3 }, trackCheck: { position: "absolute", top: 12, right: 12, width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }, dateLabel: { color: colors.text, fontSize: 15, fontWeight: "800", marginTop: 27, marginBottom: 10 }, dateLabelCompact: { marginTop: 17, marginBottom: 7 }, inputWrap: { height: 56, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: "#FFFFFF", flexDirection: "row", alignItems: "center", paddingHorizontal: 16, gap: 11 }, input: { flex: 1, color: colors.text, fontSize: 15, height: "100%" }, helper: { color: colors.textSecondary, fontSize: 12, marginTop: 8 }, footer: { paddingVertical: 14 }, footerCompact: { paddingVertical: 8 }, pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
});
