import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import QRCode from 'react-native-qrcode-svg';
import { Colors } from "../../src/constants/colors";
import { Spacing, BorderRadius, Shadows } from "../../src/constants/spacing";
import { Typography } from "../../src/constants/fonts";
import PremiumCard from "../../src/components/PremiumCard";
import PremiumButton from "../../src/components/PremiumButton";
import { useOrders } from "../../src/hooks/useOrders";
import { useAppPause } from "../../src/store/AppPauseContext";

export default function OrdersScreen() {
  const { orders, loading } = useOrders();
  const { isAppPaused, pauseReason } = useAppPause();
  const [selectedTab, setSelectedTab] = useState<"active" | "past">("active");
  const [selectedOrderForQR, setSelectedOrderForQR] = useState<string | null>(null);

  const activeOrders = orders.filter((o) => ["pending", "preparing", "ready"].includes(o.status));
  const pastOrders = orders.filter((o) => o.status === "completed");
  const displayOrders = selectedTab === "active" ? activeOrders : pastOrders;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#10B981";
      case "preparing":
        return "#3B82F6";
      case "ready":
        return "#10B981";
      case "completed":
        return "#6B7280";
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "checkmark-circle";
      case "preparing":
        return "flame";
      case "ready":
        return "checkmark-circle";
      case "completed":
        return "checkmark-done";
      default:
        return "help-circle";
    }
  };

  const renderOrder = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => item.status !== "completed" && setSelectedOrderForQR(item.id)}
      activeOpacity={item.status !== "completed" ? 0.8 : 1}
    >
      <PremiumCard style={styles.orderCard} delay={index * 100}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={[Typography.h4, { color: Colors.textPrimary }]}>
              Order #{item.orderNumber || item.id.slice(-4).toUpperCase()}
            </Text>
            <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { 
                backgroundColor: item.status === "ready" ? "#10B98120" : item.status === "completed" ? "#6B728020" : getStatusColor(item.status) + "20",
                borderColor: item.status === "ready" ? "#10B981" : item.status === "completed" ? "#6B7280" : getStatusColor(item.status) 
              },
            ]}
          >
            <Ionicons name={getStatusIcon(item.status) as any} size={16} color={item.status === "ready" ? "#10B981" : item.status === "completed" ? "#6B7280" : getStatusColor(item.status)} />
            <Text style={[Typography.caption, { color: item.status === "ready" ? "#10B981" : item.status === "completed" ? "#6B7280" : getStatusColor(item.status), fontWeight: "600" }]}>
              {item.status === "completed" ? "SERVED" : item.status === "ready" ? "READY" : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.orderItems}>
          {(item.items || []).map((menuItem: any, idx: number) => (
            <View key={menuItem.id || idx} style={styles.itemRow}>
              <Text style={[Typography.bodySmall, { color: Colors.textPrimary }]}>
                {menuItem.quantity}x {menuItem.name || 'Item'}
              </Text>
              <Text style={[Typography.bodySmall, { color: Colors.primary, fontWeight: "600" }]}>
                ₹{menuItem.price * menuItem.quantity}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.orderFooter}>
          <View>
            <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Total</Text>
            <Text style={[Typography.h4, { color: Colors.primary }]}>₹{item.total}</Text>
          </View>
          {item.estimatedTime && (
            <View style={styles.timeEstimate}>
              <Ionicons name="time" size={16} color={Colors.primary} />
              <Text style={[Typography.caption, { color: Colors.primary, fontWeight: "600" }]}>
                {item.estimatedTime} min
              </Text>
            </View>
          )}
        </View>

        {item.status !== "completed" && (
          <Text style={[Typography.caption, { color: Colors.textSecondary, marginTop: Spacing.md, textAlign: "center" }]}>
            Tap to view QR code
          </Text>
        )}

        {item.status !== "completed" && (
          <PremiumButton
            title="Track Order"
            onPress={() => {}}
            variant="secondary"
            size="sm"
            fullWidth
            style={{ marginTop: Spacing.md }}
          />
        )}
      </PremiumCard>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <Text style={[Typography.h2, { color: Colors.textPrimary }]}>My Orders</Text>
        </Animated.View>

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

        {/* Tab Selection */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setSelectedTab("active")}
            style={[styles.tab, selectedTab === "active" && styles.tabActive]}
          >
            <Text
              style={[
                Typography.button,
                {
                  color: selectedTab === "active" ? Colors.primary : Colors.textSecondary,
                },
              ]}
            >
              Active ({activeOrders.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedTab("past")}
            style={[styles.tab, selectedTab === "past" && styles.tabActive]}
          >
            <Text
              style={[
                Typography.button,
                {
                  color: selectedTab === "past" ? Colors.primary : Colors.textSecondary,
                },
              ]}
            >
              Past ({pastOrders.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Orders List */}
        <View style={styles.ordersContainer}>
          {displayOrders.length > 0 ? (
            <FlatList
              data={displayOrders}
              renderItem={renderOrder}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              nestedScrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 48 }}>📭</Text>
              <Text style={[Typography.h4, { color: Colors.textPrimary, marginTop: Spacing.md }]}>
                No {selectedTab} orders
              </Text>
              <Text style={[Typography.bodySmall, { color: Colors.textSecondary, marginTop: Spacing.sm }]}>
                {selectedTab === "active"
                  ? "Order something delicious today!"
                  : "Your past orders will appear here"}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* QR Code Modal */}
      <Modal
        visible={selectedOrderForQR !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedOrderForQR(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.qrContainer}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedOrderForQR(null)}
            >
              <Ionicons name="close" size={28} color={Colors.textPrimary} />
            </TouchableOpacity>

            {/* QR Code Header */}
            <Text style={[Typography.h3, { color: Colors.textPrimary, marginBottom: Spacing.md, textAlign: "center" }]}>
              Order QR Code
            </Text>

            {/* QR Code Box */}
            <View style={styles.qrBox}>
              {selectedOrderForQR && (
                <QRCode
                  value={orders.find(o => o.id === selectedOrderForQR)?.orderNumber?.toString() || selectedOrderForQR}
                  size={200}
                />
              )}
            </View>

            {/* Order Details */}
            {selectedOrderForQR && (
              <View style={styles.qrDetails}>
                <Text style={[Typography.h4, { color: Colors.textPrimary, textAlign: "center" }]}>
                  Order #{orders.find(o => o.id === selectedOrderForQR)?.orderNumber || selectedOrderForQR.slice(-4).toUpperCase()}
                </Text>
                <Text style={[Typography.bodySmall, { color: Colors.textSecondary, textAlign: "center", marginTop: Spacing.sm }]}>
                  Share this QR code with the counter staff to collect your order
                </Text>
              </View>
            )}

            {/* Action Button */}
            <PremiumButton
              title="Done"
              onPress={() => setSelectedOrderForQR(null)}
              variant="primary"
              size="lg"
              fullWidth
              style={{ marginTop: Spacing.lg }}
            />
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
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
    alignItems: "center",
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  ordersContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  orderCard: {
    marginBottom: Spacing.lg,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  orderItems: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  timeEstimate: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing.xl * 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  qrContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    width: "100%",
    maxWidth: 400,
    ...Shadows.lg,
  },
  closeButton: {
    position: "absolute",
    top: Spacing.lg,
    right: Spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  qrBox: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.border,
    minHeight: 250,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: "dashed",
  },
  qrCodeDisplay: {
    alignItems: "center",
    justifyContent: "center",
  },
  qrCodeText: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.primary,
    letterSpacing: 2,
    marginBottom: 8,
    fontFamily: "monospace",
  },
  qrTimestamp: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: "monospace",
  },
  qrDetails: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
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
});
