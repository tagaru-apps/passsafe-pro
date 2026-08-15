import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Card, Pill, colors } from "@/components/passsafe-ui";
import { ScreenContainer } from "@/components/screen-container";
import { usePassSafe } from "@/lib/passsafe-context";
import { startSession } from "@/lib/session-store";

type Mode = "quick" | "topic" | "mock" | "night";
const modes: { key: Mode; title: string; detail: string; icon: keyof typeof MaterialIcons.glyphMap; tone: "green" | "amber" | "dark" }[] = [
  { key: "quick", title: "Quick Practice", detail: "10 random questions · ~8 min", icon: "bolt", tone: "amber" },
  { key: "topic", title: "Topic Drill", detail: "Choose a knowledge area to target", icon: "menu-book", tone: "green" },
  { key: "mock", title: "Full Mock Exam", detail: "20 questions · Exam-like pacing", icon: "assignment", tone: "green" },
  { key: "night", title: "Night Before", detail: "High-yield recall when time is short", icon: "nights-stay", tone: "dark" },
];

export default function StudyScreen() {
  const router = useRouter();
  const { certTrack } = usePassSafe();
  const selectMode = (mode: Mode) => {
    if (mode === "topic") { router.push("/topic" as never); return; }
    const session = startSession(mode, certTrack);
    router.push({ pathname: "/session" as never, params: { id: session.id } } as never);
  };
  return <ScreenContainer style={styles.screen}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><Text style={styles.title}>Study Modes</Text><Text style={styles.subtitle}>Choose the right kind of practice for the time you have.</Text><View style={styles.cards}>{modes.map((mode) => <Pressable key={mode.key} onPress={() => selectMode(mode.key)} style={({ pressed }) => [pressed && styles.pressed]}><Card style={[styles.modeCard, mode.tone === "dark" && styles.nightCard]}><View style={[styles.modeIcon, mode.tone === "amber" && styles.amberIcon, mode.tone === "dark" && styles.nightIcon]}><MaterialIcons name={mode.icon} size={24} color={mode.tone === "dark" ? "#FFFFFF" : mode.tone === "amber" ? "#B45309" : colors.primary} /></View><View style={styles.modeText}><View style={styles.modeTitleLine}><Text style={[styles.modeTitle, mode.tone === "dark" && styles.nightText]}>{mode.title}</Text>{mode.key === "quick" ? <Pill label="FAST" tone="amber" /> : null}</View><Text style={[styles.modeDetail, mode.tone === "dark" && styles.nightDetail]}>{mode.detail}</Text></View><MaterialIcons name="chevron-right" size={23} color={mode.tone === "dark" ? "#FFFFFF" : colors.textSecondary} /></Card></Pressable>)}</View><Card style={styles.tipCard}><MaterialIcons name="lightbulb-outline" color="#B45309" size={22} /><View style={styles.tipText}><Text style={styles.tipTitle}>Smart study tip</Text><Text style={styles.tipCopy}>Short, repeated practice is more effective than a single long review.</Text></View></Card></ScrollView></ScreenContainer>;
}

const styles = StyleSheet.create({ screen: { backgroundColor: colors.background }, content: { padding: 20, paddingBottom: 28 }, title: { color: colors.text, fontSize: 25, fontWeight: "800" }, subtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 20, marginTop: 7 }, cards: { gap: 13, marginTop: 24 }, modeCard: { minHeight: 104, flexDirection: "row", alignItems: "center", padding: 16, gap: 14 }, nightCard: { backgroundColor: "#111827", borderColor: "#111827" }, modeIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: "#F0FDF4", alignItems: "center", justifyContent: "center" }, amberIcon: { backgroundColor: colors.accentLight }, nightIcon: { backgroundColor: "rgba(255,255,255,0.14)" }, modeText: { flex: 1 }, modeTitleLine: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }, modeTitle: { color: colors.text, fontSize: 16, fontWeight: "800" }, nightText: { color: "#FFFFFF" }, modeDetail: { color: colors.textSecondary, fontSize: 12, lineHeight: 17, marginTop: 5 }, nightDetail: { color: "#D1D5DB" }, tipCard: { padding: 16, marginTop: 20, flexDirection: "row", gap: 12, backgroundColor: "#FFFBEB", borderColor: "#FDE68A" }, tipText: { flex: 1 }, tipTitle: { color: "#92400E", fontSize: 13, fontWeight: "800" }, tipCopy: { color: "#92400E", fontSize: 12, lineHeight: 17, marginTop: 3 }, pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] }, });
