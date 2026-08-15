import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/components/passsafe-ui";

export type WeeklyTrendPoint = { date: string; label: string; questions: number };

export function WeeklyRewardTrend({ data }: { data: WeeklyTrendPoint[] }) {
  const maximum = Math.max(10, ...data.map((point) => point.questions));
  return <View style={styles.wrap}><Text style={styles.title}>Daily unlocks</Text><View style={styles.chart}>{data.map((point) => <View key={point.date} style={styles.column}><Text style={styles.value}>{point.questions || ""}</Text><View style={styles.barArea}><View style={[styles.bar, { height: `${Math.max(4, (point.questions / maximum) * 100)}%`, opacity: point.questions ? 1 : 0.25 }]} /></View><Text style={styles.label}>{point.label}</Text></View>)}</View></View>;
}

const styles = StyleSheet.create({
  wrap: { width: "100%", marginTop: 18, padding: 14, borderRadius: 14, backgroundColor: "#F9FAFB" },
  title: { color: colors.text, fontSize: 12, fontWeight: "800", marginBottom: 10 },
  chart: { height: 108, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 5 },
  column: { flex: 1, alignItems: "center", height: "100%" },
  value: { minHeight: 15, color: colors.primary, fontSize: 10, fontWeight: "800" },
  barArea: { flex: 1, width: "100%", justifyContent: "flex-end", alignItems: "center" },
  bar: { width: "58%", minWidth: 8, borderRadius: 6, backgroundColor: colors.primary },
  label: { color: colors.textSecondary, fontSize: 10, marginTop: 6 },
});
