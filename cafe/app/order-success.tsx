import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../src/constants/colors";
import { Spacing, BorderRadius, Shadows } from "../src/constants/spacing";
import { Typography } from "../src/constants/fonts";
import PremiumButton from "../src/components/PremiumButton";

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { id, total } = useLocalSearchParams();
  const [estimatedTime] = useState(25); // 25 minutes delivery estimate

  const handleViewOrder = () => {
    router.push("/(tabs)/orders");
  };

  const handleContinueShopping = () => {
    router.push("/(tabs)");
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {/* Success Icon Animation */}
      <Animated.View
        entering={FadeInDown.delay(0).duration(600)}
        style={styles.iconContainer}
      >
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-done" size={60} color={Colors.background} />
        </View>
      </Animated.View>

      {/* Success Message */}
      <Animated.View entering={FadeInDown.delay(200).duration(600)}>
        <Text style={[Typography.h2, styles.successTitle]}>
          Order Placed! 🎉
        </Text>
        <Text
          style={[
            Typography.bodySmall,
            {
              color: Colors.textSecondary,
              textAlign: "center",
              marginTop: Spacing.md,
            },
          ]}
        >
          Thank you for your order. Your delicious items are being prepared.
        </Text>
      </Animated.View>

      {/* Order Details Card */}
      <Animated.View
        entering={FadeInDown.delay(400).duration(600)}
        style={styles.detailsCard}
      >
        {/* Order ID */}
        <View style={styles.detailRow}>
          <View style={styles.detailLabel}>
            <Ionicons
              name="barcode"
              size={20}
              color={Colors.primary}
              style={{ marginRight: Spacing.md }}
            />
            <Text style={[Typography.body, { color: Colors.textSecondary }]}>
              Order ID
            </Text>
          </View>
          <Text style={[Typography.button, { color: Colors.textPrimary }]}>
            {id || "#ORD123456"}
          </Text>
        </View>

        {/* Delivery Time */}
        <View style={styles.detailRow}>
          <View style={styles.detailLabel}>
            <Ionicons
              name="time"
              size={20}
              color={Colors.primary}
              style={{ marginRight: Spacing.md }}
            />
            <Text style={[Typography.body, { color: Colors.textSecondary }]}>
              Est. Delivery
            </Text>
          </View>
          <Text style={[Typography.button, { color: Colors.textPrimary }]}>
            {estimatedTime} min
          </Text>
        </View>

        {/* Total Amount */}
        <View style={[styles.detailRow, styles.totalRow]}>
          <View style={styles.detailLabel}>
            <Ionicons
              name="wallet"
              size={20}
              color={Colors.primary}
              style={{ marginRight: Spacing.md }}
            />
            <Text style={[Typography.body, { color: Colors.textSecondary }]}>
              Total Amount
            </Text>
          </View>
          <Text style={[Typography.h3, { color: Colors.primary }]}>
            ₹{total || "0"}
          </Text>
        </View>
      </Animated.View>

      {/* Status Timeline */}
      <Animated.View
        entering={FadeInDown.delay(600).duration(600)}
        style={styles.timelineCard}
      >
        <Text
          style={[
            Typography.h4,
            { color: Colors.textPrimary, marginBottom: Spacing.lg },
          ]}
        >
          Order Status
        </Text>

        <View style={styles.timelineItem}>
          <View style={[styles.timelineIcon, styles.completed]}>
            <Ionicons name="checkmark" size={16} color={Colors.background} />
          </View>
          <View style={styles.timelineContent}>
            <Text style={[Typography.button, { color: Colors.textPrimary }]}>
              Order Confirmed
            </Text>
            <Text
              style={[
                Typography.caption,
                { color: Colors.textSecondary, marginTop: 4 },
              ]}
            >
              Your order has been confirmed
            </Text>
          </View>
        </View>

        <View style={styles.timelineLine} />

        <View style={styles.timelineItem}>
          <View style={[styles.timelineIcon, styles.pending]}>
            <View style={styles.pendingDot} />
          </View>
          <View style={styles.timelineContent}>
            <Text style={[Typography.button, { color: Colors.textSecondary }]}>
              Preparing
            </Text>
            <Text
              style={[
                Typography.caption,
                { color: Colors.textSecondary, marginTop: 4 },
              ]}
            >
              Your items are being prepared
            </Text>
          </View>
        </View>

        <View style={styles.timelineLine} />

        <View style={styles.timelineItem}>
          <View style={[styles.timelineIcon, styles.pending]}>
            <View style={styles.pendingDot} />
          </View>
          <View style={styles.timelineContent}>
            <Text style={[Typography.button, { color: Colors.textSecondary }]}>
              Ready for Pickup
            </Text>
            <Text
              style={[
                Typography.caption,
                { color: Colors.textSecondary, marginTop: 4 },
              ]}
            >
              Your order will be ready soon
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Action Buttons */}
      <Animated.View
        entering={FadeInUp.delay(800).duration(600)}
        style={styles.buttonContainer}
      >
        <PremiumButton
          title="View Order"
          onPress={handleViewOrder}
          variant="primary"
          size="lg"
          style={styles.button}
        />
        <PremiumButton
          title="Continue Shopping"
          onPress={handleContinueShopping}
          variant="secondary"
          size="lg"
          style={styles.button}
        />
      </Animated.View>

      {/* Celebration Emojis */}
      <Animated.View
        entering={FadeInDown.delay(1000).duration(600)}
        style={styles.celebrationContainer}
      >
        <Text style={styles.celebration}>☕ 🎉 🥐</Text>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl * 2,
    paddingBottom: Spacing.xl * 3,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  successTitle: {
    color: Colors.textPrimary,
    textAlign: "center",
  },
  detailsCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.xl * 2,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  totalRow: {
    borderBottomWidth: 0,
    paddingTop: Spacing.lg,
    backgroundColor: Colors.backgroundSecondary,
    marginHorizontal: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  detailLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  timelineCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
    marginTop: 4,
  },
  completed: {
    backgroundColor: Colors.primary,
  },
  pending: {
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  pendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  timelineContent: {
    flex: 1,
  },
  timelineLine: {
    width: 2,
    height: 20,
    backgroundColor: Colors.border,
    marginLeft: 15,
    marginVertical: Spacing.xs,
  },
  buttonContainer: {
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  button: {
    marginBottom: Spacing.md,
  },
  celebrationContainer: {
    alignItems: "center",
    marginTop: Spacing.xl,
  },
  celebration: {
    fontSize: 48,
  },
});
