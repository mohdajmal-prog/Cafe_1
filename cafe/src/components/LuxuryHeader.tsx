import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { Spacing, BorderRadius, Shadows } from "../constants/spacing";
import { Typography } from "../constants/fonts";
import { useUser } from "../store/UserContext";

export default function LuxuryHeader() {
  const { user } = useUser();

  return (
    <Animated.View entering={FadeInDown.duration(600)} style={styles.container}>
      {/* Top Section with Greeting */}
      <View style={styles.topSection}>
        <View style={styles.greetingSection}>
          <Text style={[Typography.bodySmall, { color: Colors.textSecondary }]}>
            Good Morning 👋
          </Text>
          <Text style={[Typography.h2, { color: Colors.textPrimary }]}>
            {user?.name.split(" ")[0]} welcome back!
          </Text>
        </View>
      </View>

      {/* Location Bar */}
      <TouchableOpacity style={styles.locationBar}>
        <View style={styles.locationIcon}>
          <Ionicons name="location" size={16} color={Colors.primary} />
        </View>
        <View style={styles.locationText}>
          <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
            Delivery to
          </Text>
          <Text style={[Typography.body, { color: Colors.textPrimary, fontWeight: "600" }]}>
            srm campus 📍
          </Text>
        </View>
        <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
  },
  greetingSection: {
    flex: 1,
  },
  locationBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  locationIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  locationText: {
    flex: 1,
  },
});
