import { StyleSheet, Text, View } from "react-native";

export function AdBanner({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return <View style={styles.placeholder}><Text style={styles.label}>Ad placement · Native banner preview</Text></View>;
}

const styles = StyleSheet.create({
  placeholder: { minHeight: 50, borderWidth: 1, borderStyle: "dashed", borderColor: "#D1D5DB", borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#F3F4F6" },
  label: { color: "#9CA3AF", fontSize: 10 },
});
