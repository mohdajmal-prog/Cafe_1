import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Colors } from "../constants/colors";
import { Spacing, BorderRadius, Shadows } from "../constants/spacing";
import { Typography } from "../constants/fonts";
import { Ionicons } from "@expo/vector-icons";

interface PromoBannerProps {
  delay?: number;
}

export default function PromoBanner({ delay = 0 }: PromoBannerProps) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(600)}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Offer 1 */}
        <View style={[styles.banner, styles.banner1]}>
          <View>
            <Text style={[Typography.bodySmall, { color: Colors.textPrimary }]}>
              First Order
            </Text>
            <Text style={[Typography.h3, { color: Colors.textPrimary }]}>
              20% OFF
            </Text>
            <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
              On orders above ₹200
            </Text>
          </View>
          <Text style={styles.emoji}>🎉</Text>
        </View>

        {/* Offer 2 */}
        <View style={[styles.banner, styles.banner2]}>
          <View>
            <Text style={[Typography.bodySmall, { color: Colors.textPrimary }]}>
              Free Delivery
            </Text>
            <Text style={[Typography.h3, { color: Colors.textPrimary }]}>
              TODAY ONLY
            </Text>
            <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
              On all orders
            </Text>
          </View>
          <Text style={styles.emoji}>🚚</Text>
        </View>

        {/* Offer 3 */}
        <View style={[styles.banner, styles.banner3]}>
          <View>
            <Text style={[Typography.bodySmall, { color: Colors.textPrimary }]}>
              Extra Rewards
            </Text>
            <Text style={[Typography.h3, { color: Colors.textPrimary }]}>
              2x POINTS
            </Text>
            <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
              Plus free beverage
            </Text>
          </View>
          <Text style={styles.emoji}>⭐</Text>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  banner: {
    width: 260,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...Shadows.md,
  },
  banner1: {
    backgroundColor: "#FEE7B7",
  },
  banner2: {
    backgroundColor: "#D1E7FF",
  },
  banner3: {
    backgroundColor: "#E8D5F2",
  },
  emoji: {
    fontSize: 48,
  },
});
