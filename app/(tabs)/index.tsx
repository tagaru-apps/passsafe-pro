import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AdBanner } from "@/components/ads/ad-banner";
import { Card, Pill, PrimaryButton, ProgressBar, ReadinessGauge, colors } from "@/components/passsafe-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useCompactScreen } from "@/hooks/use-compact-screen";
import { scheduleCooldownCompleteNotification } from "@/lib/cooldown-notifications";
import { getFreeQuestionProgress } from "@/lib/entitlement-policy";
import { haptic } from "@/lib/haptics";
import { checkRewardedAdAvailability, showRewardedQuestionUnlock } from "@/lib/mobile-ads";
import { filteredQuestions, getQuestionTopics } from "@/lib/passsafe-data";
import { usePassSafe } from "@/lib/passsafe-context";
import { getWeeklyRewardSummary } from "@/lib/reward-summary";
import { startSession } from "@/lib/session-store";

export default function HomeScreen() {
  const router = useRouter();
  const { isCompact } = useCompactScreen();
  const { t, certTrack, readiness, progress, usage, language, examDate, unlockRewarded, markRecoveryOffer } = usePassSafe();
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [rewardFeedback, setRewardFeedback] = useState<string | null>(null);
  const [rewardAvailability, setRewardAvailability] = useState<"checking" | "ready" | "unavailable">("checking");
  const [showRewardToast, setShowRewardToast] = useState(false);
  const [showWeeklySummary, setShowWeeklySummary] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [displayedRemainingProgress, setDisplayedRemainingProgress] = useState(0);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastY = useRef(new Animated.Value(-14)).current;
  const confettiProgress = useRef(new Animated.Value(0)).current;
  const allowanceProgress = useRef(new Animated.Value(0)).current;
  const deferAllowanceUpdate = useRef(false);
  const pendingAllowanceProgress = useRef(0);
  const retryAfterCooldown = useRef(false);

  const total = filteredQuestions(certTrack).length;
  const questionProgress = getFreeQuestionProgress(usage);
  const remainingPercentage = questionProgress?.remainingPercentage ?? 0;
  const weeklyRewards = getWeeklyRewardSummary(usage.rewardEvents);
  const weakTopics = getQuestionTopics(certTrack).map(({ topic }) => ({ topic, score: progress[topic] ? Math.round((progress[topic].correct / progress[topic].total) * 100) : 0 })).sort((a, b) => a.score - b.score).slice(0, 2);

  const start = (mode: "quick" | "night") => {
    const session = startSession(mode, certTrack);
    router.push({ pathname: "/session" as never, params: { id: session.id } } as never);
  };
  const refreshRewardAvailability = useCallback(async () => {
    setRewardAvailability("checking");
    setRewardAvailability(await checkRewardedAdAvailability());
  }, []);

  useEffect(() => { if (!usage.isPro) void refreshRewardAvailability(); }, [refreshRewardAvailability, usage.isPro]);
  useEffect(() => {
    if (!questionProgress) return;
    if (deferAllowanceUpdate.current) { pendingAllowanceProgress.current = remainingPercentage; return; }
    setDisplayedRemainingProgress(remainingPercentage);
  }, [questionProgress, remainingPercentage]);
  useEffect(() => { Animated.timing(allowanceProgress, { toValue: displayedRemainingProgress / 100, duration: 420, useNativeDriver: false }).start(); }, [allowanceProgress, displayedRemainingProgress]);
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => setCooldownSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);
  useEffect(() => {
    if (cooldownSeconds === 0 && retryAfterCooldown.current) { retryAfterCooldown.current = false; void refreshRewardAvailability(); }
  }, [cooldownSeconds, refreshRewardAvailability]);

  const celebrateReward = () => {
    setShowRewardToast(true);
    toastOpacity.setValue(0); toastY.setValue(-14); confettiProgress.setValue(0);
    Animated.parallel([
      Animated.timing(toastOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.spring(toastY, { toValue: 0, damping: 14, stiffness: 170, useNativeDriver: true }),
      Animated.timing(confettiProgress, { toValue: 1, duration: 700, useNativeDriver: true }),
    ]).start();
    setTimeout(() => { deferAllowanceUpdate.current = false; setDisplayedRemainingProgress(pendingAllowanceProgress.current); }, 720);
    setTimeout(() => { Animated.timing(toastOpacity, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => setShowRewardToast(false)); }, 2400);
  };

  const watchReward = async () => {
    if (rewardAvailability === "unavailable") { router.push("/pro" as never); return; }
    setIsUnlocking(true); setRewardFeedback(null);
    const completed = await showRewardedQuestionUnlock();
    if (completed) {
      deferAllowanceUpdate.current = true;
      await unlockRewarded();
      haptic.success();
      setRewardFeedback("10 more questions unlocked for today.");
      celebrateReward();
      void refreshRewardAvailability();
    } else {
      haptic.error();
      setRewardFeedback("A reward is not available right now. Try again in 30 seconds or upgrade to Pro.");
      setRewardAvailability("unavailable");
      await markRecoveryOffer();
      void scheduleCooldownCompleteNotification();
      retryAfterCooldown.current = true;
      setCooldownSeconds(30);
    }
    setIsUnlocking(false);
  };

  const ctaTitle = isUnlocking ? "Loading your reward…" : rewardAvailability === "checking" ? "Checking reward availability…" : cooldownSeconds > 0 ? `Reward retry in ${cooldownSeconds}s` : rewardAvailability === "unavailable" ? "Reward unavailable · Go Pro" : "Watch ad · +10 questions";
  const ctaSubtitle = isUnlocking ? "Keep this screen open" : cooldownSeconds > 0 ? "We’ll check availability again automatically" : rewardAvailability === "unavailable" ? "Unlimited questions, no ads" : "Reward ready · unlock instantly after completion";

  return <ScreenContainer style={styles.screen}>
    <ScrollView contentContainerStyle={[styles.content, isCompact && styles.contentCompact]} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, isCompact && styles.headerCompact]}><View><Text style={styles.greeting}>{t("goodMorning")} Alex</Text><Text style={styles.scoreTitle}>{t("readinessScore")}</Text></View><View style={styles.headerRight}><Pill label={usage.isPro ? "PRO" : `${usage.answeredToday}/${50 + usage.rewardedUnlocks * 10}`} tone="green" /><MaterialIcons name="notifications-none" size={24} color={colors.text} /></View></View>
      <Card style={[styles.gaugeCard, isCompact && styles.cardCompact]}><ReadinessGauge value={readiness} /><Text style={styles.gaugeMessage}>{readiness >= 75 ? "Almost ready" : "Build your momentum"} — {Math.max(0, 75 - readiness)}% from passing</Text><Text style={styles.gaugeHint}>You need 75% to pass</Text><View style={styles.examNote}><MaterialIcons name={examDate ? "event" : "calendar-today"} size={15} color="#B45309" /><Text style={styles.examText}>{examDate ? `Exam date set: ${examDate}` : "Set an exam date in Profile to personalize your plan."}</Text></View></Card>
      {usage.isPro ? <View style={styles.proAllowance}><MaterialIcons name="verified" size={18} color="#FFFFFF" /><View style={styles.proAllowanceCopy}><Text style={styles.proAllowanceTitle}>PassSafe Pro</Text><Text style={styles.proAllowanceText}>Unlimited questions today · No daily limit</Text></View></View> : questionProgress ? <Card style={[styles.allowanceCard, isCompact && styles.cardCompact]}>
        <View style={styles.allowanceHeader}><View><Text style={styles.allowanceTitle}>Daily free questions</Text><Text style={styles.allowanceSubtext}>{questionProgress.used} of {questionProgress.allowance} questions used today</Text></View><View style={styles.remainingBadge}><Text style={styles.remainingValue}>{questionProgress.remaining}</Text><Text style={styles.remainingLabel}>left</Text></View></View>
        <View style={styles.allowanceProgress}><View style={styles.animatedTrack}><Animated.View style={[styles.animatedFill, { width: allowanceProgress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }), backgroundColor: questionProgress.remaining <= 10 ? colors.accent : colors.primary }]} /></View></View>
        <Pressable accessibilityRole="button" accessibilityLabel={rewardAvailability === "unavailable" ? "Upgrade to Pro for unlimited questions" : "Watch rewarded ad to unlock 10 more questions"} disabled={isUnlocking || rewardAvailability === "checking" || cooldownSeconds > 0} onPress={watchReward} style={({ pressed }) => [styles.rewardCta, rewardAvailability === "unavailable" && cooldownSeconds === 0 && styles.rewardUpgradeCta, (isUnlocking || rewardAvailability === "checking" || cooldownSeconds > 0) && styles.rewardCtaDisabled, pressed && styles.pressed]}>{isUnlocking || rewardAvailability === "checking" ? <ActivityIndicator size="small" color="#FFFFFF" /> : <MaterialIcons name={rewardAvailability === "unavailable" && cooldownSeconds === 0 ? "workspace-premium" : "play-circle-filled"} size={22} color="#FFFFFF" />}<View style={styles.rewardCtaCopy}><Text style={styles.rewardCtaTitle}>{ctaTitle}</Text><Text style={styles.rewardCtaSubtitle}>{ctaSubtitle}</Text></View><MaterialIcons name="chevron-right" size={21} color="#FFFFFF" /></Pressable>
        {rewardAvailability === "unavailable" ? <Pressable accessibilityRole="button" onPress={() => router.push("/pro" as never)} style={({ pressed }) => [styles.proPrompt, pressed && styles.pressed]}><MaterialIcons name="workspace-premium" size={17} color={colors.primary} /><Text style={styles.proPromptText}>Prefer unlimited? View PassSafe Pro</Text><MaterialIcons name="chevron-right" size={18} color={colors.primary} /></Pressable> : null}
        <Pressable accessibilityRole="button" onPress={() => setShowWeeklySummary(true)} style={({ pressed }) => [styles.weeklyTrigger, pressed && styles.pressed]}><MaterialIcons name="insights" size={17} color={colors.primary} /><Text style={styles.weeklyTriggerText}>This week: {weeklyRewards.questions} bonus questions</Text><Text style={styles.weeklyTriggerAction}>View</Text></Pressable>
        {rewardFeedback ? <Text style={[styles.rewardFeedback, rewardFeedback.startsWith("10") ? styles.rewardSuccess : styles.rewardFailure]}>{rewardFeedback}</Text> : null}<Text style={styles.allowanceHint}>{usage.rewardedUnlocks > 0 ? `Your ${usage.rewardedUnlocks * 10} rewarded bonus questions are included.` : "No subscription needed. You can watch a reward whenever you want more practice."}</Text>
      </Card> : null}
      <Card style={[styles.dailyCard, isCompact && styles.cardCompact]}><View style={styles.dailyLine}><View style={styles.dailyCopy}><Text style={styles.cardTitle}>{t("todayQuestions")}</Text><Text style={styles.cardSubtitle}>{total} Qs · ~8 min · {language.toUpperCase()} · FDA Glossary</Text></View><View style={styles.roundArrow}><MaterialIcons name="arrow-forward" size={19} color="#FFFFFF" /></View></View><View style={styles.dailyAction}><PrimaryButton label="Start today’s set" onPress={() => start("quick")} /></View></Card>
      <Card style={[styles.drillCard, isCompact && styles.cardCompact]}><View style={styles.cardHeader}><View><Text style={styles.cardTitle}>2-Minute Drill</Text><Text style={styles.cardSubtitle}>A quick confidence boost before your day gets busy.</Text></View><Pill label="FAST" tone="amber" /></View><PrimaryButton label="Start a fast drill" icon="bolt" onPress={() => start("night")} /></Card>
      <Card style={[styles.focusCard, isCompact && styles.cardCompact]}><View style={styles.cardHeader}><Text style={styles.cardTitle}>{t("focusAreas")}</Text><MaterialIcons name="insights" color={colors.primary} size={20} /></View>{weakTopics.map((item) => <View style={styles.focusRow} key={item.topic}><View style={styles.focusMain}><Text style={styles.focusTopic}>{item.topic}</Text><View style={styles.focusBar}><ProgressBar value={item.score} color={colors.danger} /></View></View><Text style={styles.focusScore}>{item.score}%</Text></View>)}<View style={styles.focusAction}><PrimaryButton label="Practice focus areas" onPress={() => router.push("/(tabs)/study" as never)} /></View></Card>
      <View style={[styles.banner, isCompact && styles.bannerCompact]}><AdBanner visible={!usage.isPro} /></View>
    </ScrollView>
    {showRewardToast ? <View pointerEvents="none" style={styles.celebrationLayer}><Animated.View style={[styles.rewardToast, { opacity: toastOpacity, transform: [{ translateY: toastY }] }]}><MaterialIcons name="check-circle" size={20} color="#FFFFFF" /><Text style={styles.rewardToastText}>+10 questions unlocked</Text></Animated.View><Animated.Text style={[styles.confetti, styles.confettiOne, { transform: [{ translateY: confettiProgress.interpolate({ inputRange: [0, 1], outputRange: [0, -116] }) }] }]}>✦</Animated.Text><Animated.Text style={[styles.confetti, styles.confettiTwo, { transform: [{ translateY: confettiProgress.interpolate({ inputRange: [0, 1], outputRange: [0, -96] }) }] }]}>●</Animated.Text><Animated.Text style={[styles.confetti, styles.confettiThree, { transform: [{ translateY: confettiProgress.interpolate({ inputRange: [0, 1], outputRange: [0, -132] }) }] }]}>✦</Animated.Text></View> : null}
    <Modal visible={showWeeklySummary} transparent animationType="fade" onRequestClose={() => setShowWeeklySummary(false)}><View style={styles.weeklyOverlay}><View style={styles.weeklyModal}><View style={styles.weeklyIcon}><MaterialIcons name="auto-graph" size={31} color="#FFFFFF" /></View><Text style={styles.weeklyTitle}>Your weekly reward summary</Text><Text style={styles.weeklyQuestions}>{weeklyRewards.questions}</Text><Text style={styles.weeklyLabel}>extra questions unlocked this week</Text><View style={styles.weeklyStat}><Text style={styles.weeklyStatValue}>{weeklyRewards.unlocks}</Text><Text style={styles.weeklyStatLabel}>rewarded ad{weeklyRewards.unlocks === 1 ? "" : "s"} completed</Text></View><Text style={styles.weeklyCopy}>{weeklyRewards.questions > 0 ? "Nice work—those bonus questions are helping you build steady practice momentum." : "Complete a rewarded ad when available to unlock 10 extra practice questions."}</Text><Pressable accessibilityRole="button" onPress={() => setShowWeeklySummary(false)} style={({ pressed }) => [styles.weeklyClose, pressed && styles.pressed]}><Text style={styles.weeklyCloseText}>Done</Text></Pressable></View></View></Modal>
  </ScreenContainer>;
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background }, content: { paddingBottom: 30 }, contentCompact: { paddingBottom: 18 }, header: { backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: 20, paddingVertical: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, headerCompact: { paddingVertical: 11 }, greeting: { color: colors.textSecondary, fontSize: 13 }, scoreTitle: { color: colors.text, fontSize: 18, fontWeight: "800", marginTop: 2 }, headerRight: { flexDirection: "row", alignItems: "center", gap: 13 }, gaugeCard: { marginHorizontal: 16, marginTop: 16, paddingVertical: 20, alignItems: "center", backgroundColor: colors.background }, cardCompact: { marginTop: 10, padding: 13 }, gaugeMessage: { color: "#374151", fontSize: 13, fontWeight: "700", marginTop: 8 }, gaugeHint: { color: colors.textSecondary, fontSize: 11, marginTop: 4 }, examNote: { marginTop: 15, alignSelf: "stretch", flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: "#FFFBEB", borderWidth: 1, borderColor: "#FDE68A", padding: 10, borderRadius: 10 }, examText: { color: "#92400E", fontSize: 11, flex: 1, lineHeight: 16 }, allowanceCard: { marginHorizontal: 16, marginTop: 13, padding: 16, borderColor: "#BBF7D0" }, allowanceHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }, allowanceTitle: { color: colors.text, fontSize: 15, fontWeight: "800" }, allowanceSubtext: { color: colors.textSecondary, fontSize: 12, lineHeight: 17, marginTop: 3 }, remainingBadge: { minWidth: 48, paddingHorizontal: 7, paddingVertical: 5, borderRadius: 10, backgroundColor: "#F0FDF4", alignItems: "center" }, remainingValue: { color: colors.primary, fontSize: 17, fontWeight: "800", lineHeight: 20 }, remainingLabel: { color: colors.primary, fontSize: 10, fontWeight: "700" }, allowanceProgress: { marginTop: 14 }, animatedTrack: { height: 7, borderRadius: 99, overflow: "hidden", backgroundColor: colors.border }, animatedFill: { height: "100%", borderRadius: 99 }, rewardCta: { minHeight: 58, marginTop: 13, borderRadius: 14, paddingHorizontal: 13, backgroundColor: "#B45309", flexDirection: "row", alignItems: "center", gap: 10 }, rewardUpgradeCta: { backgroundColor: colors.primary }, rewardCtaDisabled: { opacity: 0.72 }, rewardCtaCopy: { flex: 1 }, rewardCtaTitle: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" }, rewardCtaSubtitle: { color: "#FEF3C7", fontSize: 11, marginTop: 2 }, proPrompt: { minHeight: 42, marginTop: 9, borderRadius: 11, backgroundColor: "#F0FDF4", flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 11 }, proPromptText: { color: colors.primary, fontSize: 12, fontWeight: "800", flex: 1 }, weeklyTrigger: { minHeight: 40, marginTop: 10, borderRadius: 11, backgroundColor: "#F0FDF4", flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 11 }, weeklyTriggerText: { color: colors.primary, fontSize: 12, fontWeight: "800", flex: 1 }, weeklyTriggerAction: { color: colors.primary, fontSize: 12, fontWeight: "800" }, rewardFeedback: { fontSize: 11, lineHeight: 16, marginTop: 8, fontWeight: "700" }, rewardSuccess: { color: colors.primary }, rewardFailure: { color: colors.danger }, allowanceHint: { color: colors.textSecondary, fontSize: 11, lineHeight: 16, marginTop: 10 }, proAllowance: { minHeight: 56, marginHorizontal: 16, marginTop: 13, paddingHorizontal: 15, borderRadius: 14, backgroundColor: colors.primary, flexDirection: "row", alignItems: "center", gap: 10 }, proAllowanceCopy: { flex: 1 }, proAllowanceTitle: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" }, proAllowanceText: { color: "#D1FAE5", fontSize: 11, marginTop: 2 }, dailyCard: { marginHorizontal: 16, marginTop: 13, padding: 16, borderLeftWidth: 4, borderLeftColor: colors.primary }, dailyLine: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, dailyCopy: { flex: 1, paddingRight: 10 }, cardTitle: { color: colors.text, fontSize: 15, fontWeight: "800" }, cardSubtitle: { color: colors.textSecondary, fontSize: 12, lineHeight: 17, marginTop: 4 }, roundArrow: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }, dailyAction: { marginTop: 14 }, drillCard: { marginHorizontal: 16, marginTop: 13, padding: 16, borderColor: "#FDE68A" }, cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 14 }, focusCard: { marginHorizontal: 16, marginTop: 13, padding: 16 }, focusRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 12 }, focusMain: { flex: 1 }, focusTopic: { color: colors.text, fontSize: 13, fontWeight: "700", marginBottom: 6 }, focusBar: { width: "100%" }, focusScore: { width: 32, color: colors.danger, fontSize: 12, fontWeight: "800", textAlign: "right" }, focusAction: { marginTop: 16 }, banner: { minHeight: 50, marginHorizontal: 16, marginTop: 15 }, bannerCompact: { minHeight: 44, marginTop: 11 }, celebrationLayer: { ...StyleSheet.absoluteFillObject, alignItems: "center", paddingTop: 22, overflow: "hidden" }, rewardToast: { minHeight: 46, paddingHorizontal: 16, borderRadius: 23, backgroundColor: colors.primary, flexDirection: "row", alignItems: "center", gap: 8, shadowColor: "#111827", shadowOpacity: 0.22, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 5 }, rewardToastText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" }, confetti: { position: "absolute", fontSize: 22, fontWeight: "800" }, confettiOne: { top: 89, left: "30%", color: "#F59E0B" }, confettiTwo: { top: 96, left: "67%", color: "#1D9E75" }, confettiThree: { top: 108, left: "48%", color: "#60A5FA" }, weeklyOverlay: { flex: 1, backgroundColor: "rgba(17, 24, 39, 0.58)", alignItems: "center", justifyContent: "center", padding: 24 }, weeklyModal: { width: "100%", maxWidth: 380, backgroundColor: "#FFFFFF", borderRadius: 24, padding: 24, alignItems: "center" }, weeklyIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }, weeklyTitle: { color: colors.text, fontSize: 20, fontWeight: "800", textAlign: "center", marginTop: 14 }, weeklyQuestions: { color: colors.primary, fontSize: 42, fontWeight: "800", lineHeight: 48, marginTop: 10 }, weeklyLabel: { color: colors.textSecondary, fontSize: 13, textAlign: "center" }, weeklyStat: { width: "100%", marginTop: 18, padding: 13, borderRadius: 14, backgroundColor: "#F0FDF4", alignItems: "center" }, weeklyStatValue: { color: colors.primary, fontSize: 20, fontWeight: "800" }, weeklyStatLabel: { color: colors.primary, fontSize: 12, marginTop: 2 }, weeklyCopy: { color: colors.textSecondary, fontSize: 13, lineHeight: 19, textAlign: "center", marginTop: 17 }, weeklyClose: { minHeight: 48, width: "100%", borderRadius: 24, backgroundColor: colors.primary, marginTop: 20, alignItems: "center", justifyContent: "center" }, weeklyCloseText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" }, pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
});
