import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../src/constants/colors";
import { Spacing, BorderRadius, Shadows } from "../src/constants/spacing";
import { Typography } from "../src/constants/fonts";
import PremiumCard from "../src/components/PremiumCard";
import PremiumButton from "../src/components/PremiumButton";
import { useCart } from "../src/store/CartContext";
import { orderService } from "../src/services/orderService";

const paymentMethods = [
  { id: "card", name: "Credit/Debit Card", icon: "card", color: "#3B82F6" },
  { id: "upi", name: "UPI", icon: "phone-portrait", color: "#10B981" },
  { id: "wallet", name: "Digital Wallet", icon: "wallet", color: "#F59E0B" },
  { id: "cash", name: "Cash on Delivery", icon: "cash", color: "#6B7280" },
];

export default function PaymentScreen() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentSubmit = async () => {
    if (!selectedPayment) return;

    setIsProcessing(true);
    try {
      console.log('💳 Processing payment...');
      console.log('📦 Cart items:', items);
      
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create the order
      console.log('📦 Creating order...');
      const order = await orderService.createOrder(items);
      console.log('✅ Order created:', order);

      // Clear cart after successful order
      clearCart();

      // Navigate to success screen with actual order ID
      router.push({
        pathname: "/order-success",
        params: { id: order.id, total: order.total.toString() },
      });
    } catch (error) {
      console.error('❌ Payment/Order error:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Animated.View entering={FadeInDown.duration(400)} style={styles.container}>
      <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[Typography.h2, { color: Colors.textPrimary }]}>Payment</Text>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Order Summary */}
        <PremiumCard style={styles.summaryCard}>
          <Text style={[Typography.h4, { color: Colors.textPrimary, marginBottom: Spacing.md }]}>
            Order Summary
          </Text>
          {items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={[Typography.bodySmall, { color: Colors.textPrimary }]}>
                {item.quantity}x {item.name}
              </Text>
              <Text style={[Typography.bodySmall, { color: Colors.primary, fontWeight: "600" }]}>
                ₹{item.price * item.quantity}
              </Text>
            </View>
          ))}
          <View style={[styles.itemRow, { marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border }]}>
            <Text style={[Typography.h4, { color: Colors.textPrimary }]}>Total</Text>
            <Text style={[Typography.h3, { color: Colors.primary }]}>₹{total}</Text>
          </View>
        </PremiumCard>

        {/* Payment Methods */}
        <View style={styles.paymentSection}>
          <Text style={[Typography.h4, { color: Colors.textPrimary, marginBottom: Spacing.md }]}>
            Select Payment Method
          </Text>
          <View style={styles.paymentMethods}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                onPress={() => setSelectedPayment(method.id)}
                style={[
                  styles.paymentMethodCard,
                  selectedPayment === method.id && styles.selectedPaymentCard,
                ]}
              >
                <View style={styles.paymentMethodLeft}>
                  <View
                    style={[
                      styles.paymentIcon,
                      { backgroundColor: method.color + "20" },
                    ]}
                  >
                    <Ionicons name={method.icon as any} size={24} color={method.color} />
                  </View>
                  <View style={styles.paymentInfo}>
                    <Text style={[Typography.body, { color: Colors.textPrimary }]}>
                      {method.name}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.radioButton,
                    selectedPayment === method.id && styles.radioButtonSelected,
                  ]}
                >
                  {selectedPayment === method.id && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <PremiumButton
          title={isProcessing ? "Processing..." : `Pay ₹${total}`}
          onPress={handlePaymentSubmit}
          disabled={!selectedPayment || isProcessing}
          loading={isProcessing}
          fullWidth
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  backButton: {
    marginRight: Spacing.md,
    padding: Spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  summaryCard: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  paymentSection: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  paymentMethods: {
    gap: Spacing.md,
  },
  paymentMethodCard: {
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
  selectedPaymentCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "10",
  },
  paymentMethodLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  paymentIcon: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  paymentInfo: {
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: Colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
});
