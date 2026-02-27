import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Colors } from "../constants/colors";
import { Spacing } from "../constants/spacing";

export default function Card({ title }: { title: string }) {
  return (
    <Animated.View entering={FadeInUp.duration(500)} style={styles.card}>
      <Text style={styles.text}>{title}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    padding: Spacing.lg,
    borderRadius: 18,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  text: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "600",
  },
});
