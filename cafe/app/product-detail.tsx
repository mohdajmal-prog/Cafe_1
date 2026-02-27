import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../src/constants/colors";
import { Spacing, BorderRadius, Shadows } from "../src/constants/spacing";
import { Typography } from "../src/constants/fonts";
import PremiumButton from "../src/components/PremiumButton";
import PremiumCard from "../src/components/PremiumCard";
import { useCart } from "../src/store/CartContext";
import { MenuItem, CartItem } from "../src/services/types";
import { menuService } from "../src/services/menuService";
import { orderService } from "../src/services/orderService";

export default function ProductDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addItem } = useCart();
  
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [product, setProduct] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }
      
      try {
        const item = await menuService.getMenuItem(productId);
        setProduct(item);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.notFound}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    );
  }

  if (!product || !productId) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.notFound}>
          <Text style={[Typography.h3, { color: Colors.textPrimary }]}>
            Product not found
          </Text>
          <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: Spacing.md }]}>
            Product ID: {productId || 'undefined'}
          </Text>
          <PremiumButton
            title="Go Back"
            onPress={() => router.back()}
            style={{ marginTop: Spacing.lg }}
          />
        </View>
      </View>
    );
  }

  const handleAddToCart = () => {
    console.log('👆 Order Now clicked for:', product.name, 'Quantity:', quantity);
    addItem(product, quantity);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async () => {
    if (!selectedPayment) return;

    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create the order
      const cartItems: CartItem[] = [{ ...product, quantity }];
      const order = await orderService.createOrder(cartItems);

      setShowPaymentModal(false);

      // Navigate to success screen with actual order ID
      router.push({
        pathname: "/order-success",
        params: { 
          id: order.id || `order_${Date.now()}`, 
          total: (order.total || total).toString() 
        },
      });
    } catch (error) {
      console.error('❌ Payment error:', error);
      Alert.alert('Error', 'Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    {
      id: "upi",
      name: "UPI",
      icon: "swap-horizontal",
      color: "#6C5CE7",
      description: "Google Pay, PhonePe, PayTM",
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: "card",
      color: "#00B4D8",
      description: "Visa, Mastercard, Rupay",
    },
    {
      id: "wallet",
      name: "Wallet",
      icon: "wallet",
      color: "#FFB703",
      description: "Coffee Wallet Balance",
    },
  ];

  const total = product.price * quantity;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={Colors.textPrimary} />
        </TouchableOpacity>

        {/* Product Image */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.imageSection}>
          <View style={styles.imageContainer}>
            {product.image ? (
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.imagePlaceholder}>☕</Text>
            )}
          </View>
          {(product.discount ?? 0) > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{product.discount}% OFF</Text>
            </View>
          )}
        </Animated.View>

        {/* Product Info */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.infoSection}>
          <View style={styles.headerRow}>
            <View style={styles.titleSection}>
              <Text style={[Typography.h2, { color: Colors.textPrimary }]}>
                {product.name}
              </Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={[Typography.body, { color: Colors.textPrimary, marginLeft: Spacing.xs }]}>
                  {product.rating}
                </Text>
                <Text style={[Typography.caption, { color: Colors.textSecondary, marginLeft: Spacing.sm }]}>
                  ({product.reviews} reviews)
                </Text>
              </View>
            </View>
            <View style={styles.priceTag}>
              <Text style={[Typography.h3, { color: Colors.primary }]}>₹{product.price}</Text>
              {(product.discount ?? 0) > 0 && (
                <Text style={[Typography.caption, { color: Colors.textSecondary, textDecorationLine: "line-through" }]}>
                  ₹{Math.round(product.price / (1 - (product.discount ?? 0) / 100))}
                </Text>
              )}
            </View>
          </View>

          <Text style={[Typography.h4, { color: Colors.textPrimary, marginTop: Spacing.lg }]}>
            Description
          </Text>
          <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: Spacing.sm, lineHeight: 22 }]}>
            {product.description}
          </Text>

          {/* Category & Time */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="pricetag" size={16} color={Colors.primary} />
              <Text style={[Typography.caption, { color: Colors.textPrimary, marginLeft: Spacing.xs }]}>
                {product.category}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={16} color={Colors.primary} />
              <Text style={[Typography.caption, { color: Colors.textPrimary, marginLeft: Spacing.xs }]}>
                {product.time} prep time
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Quantity Selector */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.quantitySection}>
          <PremiumCard style={styles.quantityCard} delay={0}>
            <Text style={[Typography.h4, { color: Colors.textPrimary, marginBottom: Spacing.md }]}>
              Quantity
            </Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                style={styles.quantityButton}
                disabled={quantity === 1}
              >
                <Ionicons
                  name="remove-circle"
                  size={28}
                  color={quantity === 1 ? Colors.textSecondary : Colors.primary}
                />
              </TouchableOpacity>
              <Text style={[Typography.h3, { color: Colors.textPrimary }]}>{quantity}</Text>
              <TouchableOpacity
                onPress={() => setQuantity(quantity + 1)}
                style={styles.quantityButton}
              >
                <Ionicons name="add-circle" size={28} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </PremiumCard>
        </Animated.View>

        {/* Order Summary */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.summarySection}>
          <PremiumCard style={styles.summaryCard} delay={0}>
            <View style={styles.summaryRow}>
              <Text style={[Typography.body, { color: Colors.textSecondary }]}>
                Price ({quantity} x ₹{product.price})
              </Text>
              <Text style={[Typography.body, { color: Colors.textPrimary, fontWeight: "600" }]}>
                ₹{total}
              </Text>
            </View>
            <View style={[styles.summaryRow, { marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border }]}>
              <Text style={[Typography.h4, { color: Colors.textPrimary }]}>Total</Text>
              <Text style={[Typography.h3, { color: Colors.primary }]}>₹{total}</Text>
            </View>
          </PremiumCard>
        </Animated.View>

        {/* Order Now Button */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.orderButtonContainer}>
          <PremiumButton
            title="Order Now"
            onPress={handleAddToCart}
            variant="primary"
            fullWidth
          />
          <PremiumButton
            title="Add to Cart"
            onPress={() => {
              console.log('👆 Add to Cart clicked for:', product.name, 'Quantity:', quantity);
              addItem(product, quantity);
              Alert.alert('Added to Cart', `${quantity}x ${product.name} added to your cart!`);
              router.back();
            }}
            variant="ghost"
            fullWidth
            style={{ marginTop: Spacing.md }}
          />
        </Animated.View>
      </ScrollView>

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Ionicons name="close" size={28} color={Colors.textPrimary} />
              </TouchableOpacity>
              <Text style={[Typography.h3, { color: Colors.textPrimary }]}>
                Choose Payment
              </Text>
              <View style={{ width: 28 }} />
            </View>

            {/* Payment Methods */}
            <ScrollView showsVerticalScrollIndicator={false} style={styles.paymentMethods}>
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
                      <Text
                        style={[
                          Typography.caption,
                          { color: Colors.textSecondary, marginTop: 4 },
                        ]}
                      >
                        {method.description}
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
            </ScrollView>

            {/* Order Summary in Modal */}
            <View style={styles.modalSummary}>
              <View style={styles.summaryRow}>
                <Text style={[Typography.body, { color: Colors.textSecondary }]}>
                  Order Total
                </Text>
                <Text style={[Typography.h3, { color: Colors.primary }]}>₹{total}</Text>
              </View>
              <PremiumButton
                title={isProcessing ? "Processing..." : "Confirm Payment"}
                onPress={handlePaymentSubmit}
                variant="primary"
                fullWidth
                disabled={!selectedPayment || isProcessing}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },
  backButton: {
    position: "absolute",
    top: 12,
    left: Spacing.lg,
    zIndex: 10,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
  },
  imageSection: {
    width: "100%",
    height: 300,
    position: "relative",
    marginBottom: Spacing.lg,
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    fontSize: 80,
  },
  discountBadge: {
    position: "absolute",
    top: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  discountText: {
    color: Colors.textPrimary,
    fontWeight: 700,
    fontSize: 14,
  },
  infoSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: Spacing.lg,
  },
  titleSection: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  priceTag: {
    alignItems: "flex-end",
  },
  metaRow: {
    flexDirection: "row",
    gap: Spacing.lg,
    marginTop: Spacing.lg,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantitySection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  quantityCard: {
    paddingVertical: Spacing.md,
  },
  quantitySelector: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.lg,
  },
  quantityButton: {
    padding: Spacing.sm,
  },
  summarySection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  summaryCard: {
    paddingVertical: Spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderButtonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl * 2,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: "90%",
    paddingBottom: Spacing.xl,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  paymentMethods: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    maxHeight: "60%",
  },
  paymentMethodCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
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
    borderRadius: BorderRadius.lg,
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
  },
  radioButtonSelected: {
    borderColor: Colors.primary,
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    alignSelf: "center",
    marginTop: 4,
  },
  modalSummary: {
    paddingHorizontal: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.lg,
  },
});
