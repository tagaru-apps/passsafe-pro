import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { SecondaryButton, colors } from "@/components/passsafe-ui";
import { haptic } from "@/lib/haptics";
import { usePassSafe } from "@/lib/passsafe-context";
import { showRewardedQuestionUnlock } from "@/lib/mobile-ads";

export function PaywallModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const router = useRouter();
  const { usage, unlockRewarded } = usePassSafe();
  const [playing, setPlaying] = useState(false);
  const [rewardError, setRewardError] = useState(false);
  const watchReward = async () => {
    setPlaying(true);
    setRewardError(false);
    const completed = await showRewardedQuestionUnlock();
    if (completed) {
      await unlockRewarded();
      haptic.success();
      setPlaying(false);
      onClose();
      return;
    }
    haptic.error();
    setPlaying(false);
    setRewardError(true);
  };
  const goPro = () => { onClose(); router.push("/pro" as never); };
  useEffect(() => { if (!visible) setPlaying(false); }, [visible]);
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          {playing ? <View style={styles.playing}>
            <Text style={styles.playingLabel}>Rewarded placement · Playing</Text>
            <View style={styles.video}><Text style={styles.videoIcon}>📺</Text><Text style={styles.videoText}>Your AdMob rewarded placement</Text></View>
            <View style={styles.adProgress}><View style={styles.adProgressFill} /></View>
            <Text style={styles.playingHelp}>Please keep this open — 10 questions unlock automatically.</Text>
          </View> : <View style={styles.content}>
            <View style={styles.lock}><MaterialIcons name="lock" color="#B45309" size={30} /></View>
            <Text style={styles.title}>You’ve hit your free limit</Text>
            <Text style={styles.subtitle}>You answered {usage.answeredToday} today. Watch a placement for 10 more questions, or choose unlimited Pro.</Text>
            {rewardError ? <Text style={styles.errorText}>The reward was not completed. Please try again when a placement is available.</Text> : null}
            <Pressable onPress={watchReward} style={({ pressed }) => [styles.rewardOption, pressed && styles.pressed]}>
              <View style={styles.rewardIcon}><MaterialIcons name="play-arrow" size={23} color="#B45309" /></View>
              <View style={styles.optionText}><Text style={styles.optionTitle}>Watch ad — Unlock 10 Qs</Text><Text style={styles.optionSubtitle}>30 seconds · No subscription</Text></View><Text style={styles.free}>FREE</Text>
            </Pressable>
            <Pressable onPress={goPro} style={({ pressed }) => [styles.proOption, pressed && styles.pressed]}>
              <View style={styles.proIcon}><Text style={styles.crown}>♛</Text></View>
              <View style={styles.optionText}><Text style={styles.proTitle}>Go Pro — Unlimited</Text><Text style={styles.proSubtitle}>No ads · Mock exams · Night Before</Text></View><View><Text style={styles.price}>$4.99/mo</Text><Text style={styles.priceSub}>₹399/mo</Text></View>
            </Pressable>
            <Text style={styles.secure}>Secure by your store · Cancel anytime</Text>
            <SecondaryButton label="Maybe later" onPress={onClose} />
          </View>}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" }, sheet: { backgroundColor: colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 24, minHeight: 485 }, handle: { width: 42, height: 5, borderRadius: 99, backgroundColor: colors.border, alignSelf: "center", marginTop: 12, marginBottom: 8 }, content: { paddingHorizontal: 24, paddingTop: 2 }, lock: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.accentLight, alignItems: "center", justifyContent: "center", alignSelf: "center", marginTop: 3 }, title: { textAlign: "center", color: colors.text, fontSize: 24, fontWeight: "800", marginTop: 14 }, subtitle: { textAlign: "center", color: colors.textSecondary, fontSize: 14, lineHeight: 20, marginTop: 9, marginBottom: 12 }, errorText: { color: "#B91C1C", backgroundColor: "#FEF2F2", fontSize: 12, lineHeight: 17, textAlign: "center", borderRadius: 10, padding: 9, marginBottom: 10 }, rewardOption: { minHeight: 64, backgroundColor: "#FFFFFF", borderWidth: 2, borderColor: colors.accent, borderRadius: 16, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 12 }, rewardIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFFBEB", alignItems: "center", justifyContent: "center" }, optionText: { flex: 1 }, optionTitle: { color: colors.text, fontSize: 14, fontWeight: "800" }, optionSubtitle: { color: colors.textSecondary, fontSize: 12, marginTop: 3 }, free: { color: "#B45309", fontSize: 12, fontWeight: "800" }, proOption: { minHeight: 72, marginTop: 12, borderRadius: 16, paddingHorizontal: 14, backgroundColor: colors.primary, flexDirection: "row", alignItems: "center", gap: 12, shadowColor: colors.primary, shadowOpacity: 0.28, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 4 }, proIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" }, crown: { color: "#FFFFFF", fontSize: 22 }, proTitle: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" }, proSubtitle: { color: "#A7F3D0", fontSize: 11, marginTop: 3 }, price: { color: "#FFFFFF", fontSize: 14, fontWeight: "800", textAlign: "right" }, priceSub: { color: "#A7F3D0", fontSize: 10, marginTop: 2, textAlign: "right" }, secure: { color: "#9CA3AF", textAlign: "center", fontSize: 11, marginVertical: 16 }, playing: { paddingHorizontal: 24, paddingTop: 38, alignItems: "center" }, playingLabel: { color: "#6B7280", fontSize: 13, fontWeight: "700", marginBottom: 14 }, video: { height: 225, width: "100%", backgroundColor: "#1F2937", borderRadius: 16, alignItems: "center", justifyContent: "center", gap: 8 }, videoIcon: { fontSize: 46 }, videoText: { color: "#D1D5DB", fontSize: 13 }, adProgress: { width: "80%", height: 5, marginTop: 22, overflow: "hidden", backgroundColor: "#D1D5DB", borderRadius: 99 }, adProgressFill: { height: "100%", width: "100%", backgroundColor: colors.accent }, playingHelp: { color: colors.textSecondary, fontSize: 12, marginTop: 15, textAlign: "center" }, pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
});
