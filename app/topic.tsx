import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { Card, Pill, colors } from "@/components/passsafe-ui";
import { ScreenContainer } from "@/components/screen-container";
import { usePassSafe } from "@/lib/passsafe-context";
import { getQuestionTopics } from "@/lib/passsafe-data";
import { startSession } from "@/lib/session-store";

export default function TopicScreen() {
  const router = useRouter();
  const { certTrack, progress } = usePassSafe();
  const topics = getQuestionTopics(certTrack);
  const begin = (topic: string) => { const session = startSession("topic", certTrack, topic); router.push({ pathname: "/session" as never, params: { id: session.id } } as never); };
  return <ScreenContainer style={styles.screen}><FlatList data={topics} keyExtractor={(item) => item.topic} contentContainerStyle={styles.content} ListHeaderComponent={<><View style={styles.top}><Pressable onPress={() => router.back()} style={styles.back}><MaterialIcons name="arrow-back" size={21} color={colors.text} /></Pressable><View><Text style={styles.title}>Topic Drill</Text><Text style={styles.subtitle}>Select a knowledge area to practice.</Text></View></View></>} renderItem={({ item }) => { const score = progress[item.topic] ? Math.round((progress[item.topic].correct / progress[item.topic].total) * 100) : null; return <Pressable onPress={() => begin(item.topic)} style={({ pressed }) => [pressed && styles.pressed]}><Card style={styles.topicCard}><View style={styles.topicLeft}><View style={styles.book}><MaterialIcons name="menu-book" size={20} color={colors.primary} /></View><View style={styles.topicCopy}><Text style={styles.topicName}>{item.topic}</Text><Text style={styles.topicMeta}>{item.count} questions {score !== null ? `· ${score}% correct` : "· Not started"}</Text></View></View><View style={styles.topicRight}>{score !== null && score < 50 ? <Pill label="FOCUS" tone="amber" /> : null}<MaterialIcons name="chevron-right" size={22} color={colors.textSecondary} /></View></Card></Pressable>; }} /></ScreenContainer>;
}

const styles = StyleSheet.create({ screen: { backgroundColor: colors.background }, content: { padding: 20, paddingBottom: 26, gap: 12 }, top: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 13 }, back: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border }, title: { color: colors.text, fontSize: 24, fontWeight: "800" }, subtitle: { color: colors.textSecondary, fontSize: 13, marginTop: 3 }, topicCard: { minHeight: 78, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, topicLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }, book: { width: 40, height: 40, borderRadius: 13, backgroundColor: "#F0FDF4", alignItems: "center", justifyContent: "center" }, topicCopy: { flex: 1 }, topicName: { color: colors.text, fontSize: 14, fontWeight: "800" }, topicMeta: { color: colors.textSecondary, fontSize: 12, marginTop: 3 }, topicRight: { flexDirection: "row", alignItems: "center", gap: 4 }, pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] }, });
