import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

import { haptic } from "@/lib/haptics";

export const colors = {
  primary: "#1B5E40",
  primaryLight: "#2D7A55",
  accent: "#F59E0B",
  accentLight: "#FEF3C7",
  background: "#FAFAF8",
  surface: "#FFFFFF",
  text: "#111827",
  textSecondary: "#6B7280",
  success: "#1D9E75",
  danger: "#EF4444",
  border: "#E5E7EB",
};

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function PrimaryButton({ label, onPress, disabled = false, icon }: { label: string; onPress: () => void; disabled?: boolean; icon?: keyof typeof MaterialIcons.glyphMap }) {
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={() => { haptic.light(); onPress(); }} style={({ pressed }) => [styles.primaryButton, disabled && styles.disabled, pressed && styles.pressed]}>
      {icon ? <MaterialIcons name={icon} size={20} color="#FFFFFF" /> : null}
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={() => { haptic.light(); onPress(); }} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );
}

export function Pill({ label, tone = "green" }: { label: string; tone?: "green" | "amber" | "neutral" | "danger" }) {
  const palette = tone === "amber" ? styles.pillAmber : tone === "danger" ? styles.pillDanger : tone === "neutral" ? styles.pillNeutral : styles.pillGreen;
  const text = tone === "amber" ? styles.pillAmberText : tone === "danger" ? styles.pillDangerText : tone === "neutral" ? styles.pillNeutralText : styles.pillGreenText;
  return <View style={[styles.pill, palette]}><Text style={[styles.pillText, text]}>{label}</Text></View>;
}

export function ReadinessGauge({ value, size = 190 }: { value: number; size?: number }) {
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <View style={[styles.gaugeWrap, { width: size, height: size / 2 + 26 }]}>
      <Svg width={size} height={size / 2 + stroke} viewBox={`0 0 ${size} ${size / 2 + stroke}`}>
        <Path d={`M ${stroke / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - stroke / 2} ${size / 2}`} fill="none" stroke={colors.border} strokeWidth={stroke} strokeLinecap="round" />
        <Path d={`M ${stroke / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - stroke / 2} ${size / 2}`} fill="none" stroke={colors.primary} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${(circumference * clamped) / 100} ${circumference}`} />
      </Svg>
      <View style={styles.gaugeTextWrap}>
        <Text style={styles.gaugeValue}>{clamped}%</Text>
        <Text style={styles.gaugeLabel}>READINESS</Text>
      </View>
    </View>
  );
}

export function ProgressBar({ value, color = colors.primary }: { value: number; color?: string }) {
  return <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }]} /></View>;
}

export const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: "rgba(17,24,39,0.05)", shadowColor: "#111827", shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 2 },
  primaryButton: { minHeight: 56, borderRadius: 28, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, paddingHorizontal: 20, shadowColor: colors.primary, shadowOpacity: 0.28, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 4 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  secondaryButton: { minHeight: 56, borderRadius: 28, backgroundColor: "#FFFBEB", borderWidth: 2, borderColor: colors.accent, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
  secondaryButtonText: { color: "#B45309", fontSize: 16, fontWeight: "700" },
  pressed: { opacity: 0.9, transform: [{ scale: 0.97 }] },
  disabled: { opacity: 0.55 },
  pill: { alignSelf: "flex-start", borderRadius: 99, paddingHorizontal: 8, paddingVertical: 4 },
  pillText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.35 },
  pillGreen: { backgroundColor: "#F0FDF4" },
  pillGreenText: { color: colors.primary },
  pillAmber: { backgroundColor: colors.accentLight },
  pillAmberText: { color: "#B45309" },
  pillNeutral: { backgroundColor: "#F3F4F6" },
  pillNeutralText: { color: colors.textSecondary },
  pillDanger: { backgroundColor: "#FEF2F2" },
  pillDangerText: { color: "#B91C1C" },
  gaugeWrap: { alignItems: "center", justifyContent: "flex-start" },
  gaugeTextWrap: { position: "absolute", bottom: 0, alignItems: "center" },
  gaugeValue: { color: colors.primary, fontSize: 33, fontWeight: "800", lineHeight: 38 },
  gaugeLabel: { color: colors.textSecondary, fontSize: 10, fontWeight: "700", letterSpacing: 1.1, marginTop: 1 },
  progressTrack: { height: 7, backgroundColor: colors.border, borderRadius: 99, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 99 },
});
