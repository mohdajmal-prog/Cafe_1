import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../src/constants/colors";
import { Spacing, BorderRadius, Shadows } from "../../src/constants/spacing";
import { Typography } from "../../src/constants/fonts";
import PremiumCard from "../../src/components/PremiumCard";
import PremiumButton from "../../src/components/PremiumButton";
import { useCart } from "../../src/store/CartContext";
import { useAppPause } from "../../src/store/AppPauseContext";

export default function CartScreen() {
  const router = useRouter();
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();
  const { isAppPaused, pauseReason } = useAppPause();

  console.log('🛒 Cart items:', items.length, items);

  const handleCheckout = () => {
    // Navigate to payment page
    router.push("/payment");
  };

  const renderCartItem = ({ item, index }: { item: any; index: number }) => (
    <PremiumCard key={item.id} style={styles.cartItem} delay={index * 50}>
      <View style={styles.itemContent}>
        <View style={styles.itemInfo}>
          <Text style={[Typography.body, { color: Colors.textPrimary }]}>
            {item.name}
          </Text>
          <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
            ₹{item.price} each
          </Text>
        </View>

        <View style={styles.itemControls}>
          <TouchableOpacity
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
            style={styles.controlButton}
          >
            <Ionicons name="remove" size={16} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={[Typography.button, { color: Colors.textPrimary, minWidth: 30, textAlign: "center" }]}>
            {item.quantity}
          </Text>
          <TouchableOpacity
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
            style={styles.controlButton}
          >
            <Ionicons name="add" size={16} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={[Typography.button, { color: Colors.primary, marginLeft: Spacing.md }]}>
            ₹{item.price * item.quantity}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => removeItem(item.id)}
        style={styles.removeButton}
      >
        <Ionicons name="trash-outline" size={16} color={Colors.error} />
      </TouchableOpacity>
    </PremiumCard>
  );

  return (
    <Animated.View entering={FadeInDown.duration(400)} style={styles.container}>
      <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
        <Text style={[Typography.h2, { color: Colors.textPrimary }]}>
          Your Cart
        </Text>
        {items.length > 0 && (
          <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
            {items.length} item{items.length !== 1 ? "s" : ""}
          </Text>
        )}
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Pause Banner */}
        {isAppPaused && (
          <Animated.View entering={FadeInDown.duration(300)}>
            <View style={styles.pauseBanner}>
              <Text style={styles.pauseIcon}>⏸️</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.pauseTitle}>Cafe Temporarily Paused</Text>
                <Text style={styles.pauseSubtitle}>{pauseReason || 'Stock update in progress'}</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {items.length > 0 ? (
          <>
            {isAppPaused && (
              <View style={styles.pauseOverlay}>
                <Text style={styles.pauseOverlayIcon}>⏸️</Text>
                <Text style={styles.pauseOverlayText}>Ordering is temporarily disabled</Text>
                <Text style={styles.pauseOverlaySubtext}>{pauseReason || 'Please wait while we update our menu'}</Text>
              </View>
            )}
            <View style={styles.itemsContainer}>
              <FlatList
                data={items}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                nestedScrollEnabled={false}
              />
            </View>

            {/* Price Summary */}
            <PremiumCard style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={[Typography.body, { color: Colors.textSecondary }]}>
                  Subtotal
                </Text>
                <Text style={[Typography.body, { color: Colors.textPrimary }]}>
                  ₹{total}
                </Text>
              </View>

              <View style={[styles.summaryRow, { marginTop: Spacing.md }]}>
                <Text style={[Typography.body, { color: Colors.textSecondary }]}>
                  Delivery Fee
                </Text>
                <Text style={[Typography.body, { color: Colors.textPrimary }]}>
                  Free
                </Text>
              </View>

              <View
                style={[
                  styles.summaryRow,
                  { marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
                ]}
              >
                <Text style={[Typography.h4, { color: Colors.textPrimary }]}>
                  Total
                </Text>
                <Text style={[Typography.h3, { color: Colors.primary }]}>
                  ₹{total}
                </Text>
              </View>
            </PremiumCard>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 64 }}>🛒</Text>
            <Text style={[Typography.h3, { color: Colors.textPrimary, marginTop: Spacing.lg }]}>
              Your cart is empty
            </Text>
            <Text style={[Typography.bodySmall, { color: Colors.textSecondary, marginTop: Spacing.md, textAlign: "center" }]}>
              Add delicious items from our menu
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      {items.length > 0 && (
        <View style={styles.footer}>
          <PremiumButton
            title="Clear Cart"
            onPress={clearCart}
            variant="secondary"
            size="sm"
          />
          <PremiumButton
            title={`Checkout • ₹${total}`}
            onPress={handleCheckout}
            size="sm"
            disabled={isAppPaused}
            style={{ marginLeft: Spacing.md, opacity: isAppPaused ? 0.5 : 1 }}
          />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  itemsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  cartItem: {
    marginBottom: Spacing.md,
  },
  itemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemInfo: {
    flex: 1,
  },
  itemControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  controlButton: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButton: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
  },
  summaryCard: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.xl * 2,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  closeButton: {
    marginRight: Spacing.md,
    padding: Spacing.xs,
  },
  modalScrollView: {
    flex: 1,
  },
  modalSummaryCard: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
  },
  modalItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  modalPaymentSection: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  modalPaymentMethods: {
    gap: Spacing.md,
  },
  modalPaymentMethodCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  modalSelectedPaymentCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "10",
  },
  modalPaymentMethodLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  modalPaymentIcon: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  modalPaymentInfo: {
    flex: 1,
  },
  modalRadioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  modalRadioButtonSelected: {
    borderColor: Colors.primary,
  },
  modalRadioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  modalFooter: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  pauseBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: "#FFA50030",
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: "#FFA500",
    gap: Spacing.md,
  },
  pauseIcon: {
    fontSize: 24,
  },
  pauseTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  pauseSubtitle: {
    fontSize: 12,
    fontWeight: "400",
    color: Colors.textSecondary,
  },
  pauseOverlay: {
    backgroundColor: "rgba(255, 165, 0, 0.15)",
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFA500",
  },
  pauseOverlayIcon: {
    fontSize: 32,
    marginBottom: Spacing.md,
  },
  pauseOverlayText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  pauseOverlaySubtext: {
    fontSize: 12,
    fontWeight: "400",
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
