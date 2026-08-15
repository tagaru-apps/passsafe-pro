import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { PaywallModal } from "@/components/paywall-modal";
import { Card, Pill, PrimaryButton, ProgressBar, colors } from "@/components/passsafe-ui";
import { ScreenContainer } from "@/components/screen-container";
import { usePassSafe } from "@/lib/passsafe-context";
import { getLocalizedQuestion } from "@/lib/passsafe-data";
import { getSession } from "@/lib/session-store";
import { haptic } from "@/lib/haptics";
import { useCompactScreen } from "@/hooks/use-compact-screen";

export default function SessionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const session = getSession(id);
  const { language, t, canAnswer, incrementUsage, recordAnswer } = usePassSafe();
  const { isCompact } = useCompactScreen();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  if (!session || session.questions.length === 0) return <ScreenContainer style={styles.empty}><Text style={styles.emptyText}>Your practice set is no longer available.</Text><PrimaryButton label="Back to Study" onPress={() => router.replace("/(tabs)/study" as never)} /></ScreenContainer>;
  const current = session.questions[index];
  const localized = getLocalizedQuestion(current, language);
  const answered = selected !== null;
  const selectAnswer = async (answer: number) => {
    if (answered) return;
    if (!canAnswer()) { setShowPaywall(true); return; }
    setSelected(answer);
    const isCorrect = answer === localized.correctIndex;
    if (isCorrect) { setCorrect((value) => value + 1); haptic.success(); } else haptic.error();
    await recordAnswer(current.topic, isCorrect);
    await incrementUsage();
  };
  const continueSession = () => {
    if (index + 1 >= session.questions.length) { router.replace({ pathname: "/result" as never, params: { score: String(correct), total: String(session.questions.length), mode: session.mode } } as never); return; }
    setIndex((value) => value + 1); setSelected(null);
  };
  return <ScreenContainer edges={["top", "bottom", "left", "right"]} style={styles.screen}><ScrollView contentContainerStyle={[styles.content, isCompact && styles.contentCompact]} showsVerticalScrollIndicator={false}>
    <View style={[styles.top, isCompact && styles.topCompact]}><View style={styles.progressGroup}><ProgressBar value={((index + 1) / session.questions.length) * 100} /><Text style={styles.progressLabel}>{index + 1}/{session.questions.length}</Text></View><Pressable onPress={() => router.back()} style={styles.close}><MaterialIcons name="close" size={19} color={colors.text} /></Pressable></View>
    <Card style={[styles.questionCard, isCompact && styles.questionCardCompact]}><View style={styles.badges}><Pill label={current.topic.toUpperCase()} tone="amber" /><Pill label="FDA GLOSSARY" tone="green" /><Pill label={current.difficulty.toUpperCase()} tone="neutral" /></View><Text style={[styles.question, isCompact && styles.questionCompact]}>{localized.question}</Text><Text style={styles.questionMeta}>{current.id.toUpperCase()} · {language.toUpperCase()}</Text></Card>
    <View style={[styles.answers, isCompact && styles.answersCompact]}>{localized.options.map((option, optionIndex) => { const isSelected = selected === optionIndex; const isCorrect = optionIndex === localized.correctIndex; const showCorrect = answered && isCorrect; const showIncorrect = answered && isSelected && !isCorrect; return <Pressable key={`${current.id}-${optionIndex}`} onPress={() => selectAnswer(optionIndex)} style={({ pressed }) => [styles.answer, isCompact && styles.answerCompact, showCorrect && styles.answerCorrect, showIncorrect && styles.answerWrong, !answered && pressed && styles.pressed]}><View style={[styles.letter, isSelected && !answered && styles.letterSelected, showCorrect && styles.letterCorrect, showIncorrect && styles.letterWrong]}><Text style={[styles.letterText, isSelected && !answered && styles.letterTextSelected]}>{String.fromCharCode(65 + optionIndex)}</Text></View><Text style={[styles.answerText, isSelected && !answered && styles.answerTextSelected]}>{option}</Text>{showCorrect ? <MaterialIcons name="check-circle" size={22} color={colors.primary} /> : showIncorrect ? <MaterialIcons name="cancel" size={22} color={colors.danger} /> : null}</Pressable>; })}</View>
    {answered ? <Card style={[styles.explanation, isCompact && styles.explanationCompact]}><Text style={[styles.answerOutcome, selected === localized.correctIndex ? styles.correctText : styles.wrongText]}>{selected === localized.correctIndex ? `✓ ${t("correct")}!` : `✕ ${t("incorrect")}`}</Text><Text style={styles.explanationText}>{localized.explanation}</Text><View style={styles.tip}><Text style={styles.tipTitle}>💡 EXAM TIP</Text><Text style={styles.tipText}>{localized.tip}</Text></View><View style={styles.continueWrap}><PrimaryButton label={index + 1 === session.questions.length ? "See my results" : t("continue")} onPress={continueSession} /></View></Card> : null}
  </ScrollView><PaywallModal visible={showPaywall} onClose={() => setShowPaywall(false)} /></ScreenContainer>;
}

const styles = StyleSheet.create({ screen: { backgroundColor: colors.background }, content: { padding: 18, paddingBottom: 25 }, contentCompact: { padding: 14, paddingBottom: 17 }, top: { flexDirection: "row", alignItems: "center", gap: 18, marginBottom: 18 }, topCompact: { gap: 12, marginBottom: 12 }, progressGroup: { flex: 1 }, progressLabel: { color: colors.textSecondary, fontSize: 12, textAlign: "right", marginTop: 6, fontWeight: "700" }, close: { width: 34, height: 34, borderRadius: 17, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border }, questionCard: { padding: 20 }, questionCardCompact: { padding: 15 }, badges: { flexDirection: "row", flexWrap: "wrap", gap: 6 }, question: { color: colors.text, fontSize: 19, lineHeight: 27, fontWeight: "800", marginTop: 17 }, questionCompact: { fontSize: 17, lineHeight: 24, marginTop: 12 }, questionMeta: { color: "#9CA3AF", fontSize: 11, fontWeight: "700", marginTop: 15, letterSpacing: 0.5 }, answers: { gap: 11, marginTop: 16 }, answersCompact: { gap: 8, marginTop: 12 }, answer: { minHeight: 64, borderRadius: 14, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 12 }, answerCompact: { minHeight: 56, paddingHorizontal: 12, gap: 10 }, answerCorrect: { backgroundColor: "#F0FDF4", borderWidth: 2, borderColor: colors.primary }, answerWrong: { backgroundColor: "#FEF2F2", borderWidth: 2, borderColor: colors.danger }, letter: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center" }, letterSelected: { backgroundColor: colors.primary }, letterCorrect: { backgroundColor: "#D1FAE5" }, letterWrong: { backgroundColor: "#FECACA" }, letterText: { color: colors.text, fontSize: 13, fontWeight: "800" }, letterTextSelected: { color: "#FFFFFF" }, answerText: { color: colors.text, fontSize: 14, fontWeight: "600", flex: 1, lineHeight: 20 }, answerTextSelected: { color: "#FFFFFF" }, explanation: { borderLeftWidth: 4, borderLeftColor: colors.primary, padding: 17, marginTop: 17 }, explanationCompact: { padding: 14, marginTop: 13 }, answerOutcome: { fontSize: 14, fontWeight: "800" }, correctText: { color: colors.primary }, wrongText: { color: colors.danger }, explanationText: { color: "#374151", fontSize: 13, lineHeight: 19, marginTop: 9 }, tip: { backgroundColor: "#FFFBEB", borderRadius: 10, padding: 12, marginTop: 13 }, tipTitle: { color: "#92400E", fontSize: 10, fontWeight: "800", letterSpacing: 0.7 }, tipText: { color: "#92400E", fontSize: 12, lineHeight: 17, marginTop: 5 }, continueWrap: { marginTop: 16 }, pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] }, empty: { backgroundColor: colors.background, padding: 24, alignItems: "center", justifyContent: "center", gap: 18 }, emptyText: { color: colors.text, textAlign: "center", fontSize: 16, fontWeight: "700" }, });
