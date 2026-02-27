import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions } from "react-native";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { Colors } from "../constants/colors";
import { Spacing, BorderRadius, Shadows } from "../constants/spacing";
import { Typography } from "../constants/fonts";
import { MenuItem } from "../services/types";

interface FeaturedCardProps {
  item: MenuItem;
  onPress?: () => void;
  delay?: number;
  enableNavigation?: boolean;
}

export default function FeaturedCard({ item, onPress, delay = 0, enableNavigation = false }: FeaturedCardProps) {
  const scale = useSharedValue(1);
  const router = useRouter();

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 10, mass: 1 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, mass: 1 });
  };

  const handlePress = () => {
    console.log('👆 Card clicked:', item.name, 'ID:', item.id);
    if (enableNavigation) {
      console.log('📦 Navigating to product-detail with ID:', item.id);
      router.push(`/product-detail?id=${item.id}`);
    } else if (onPress) {
      onPress();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(500)}>
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          activeOpacity={0.8}
          style={styles.card}
        >
        {/* Image Placeholder */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={styles.productImage}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.emoji}>☕</Text>
            )}
          </View>
          {(item.discount ?? 0) > 0 && (
            <View style={styles.discountTag}>
              <Text style={styles.discountText}>{item.discount}%</Text>
              <Text style={[Typography.caption, { color: Colors.textPrimary }]}>
                OFF
              </Text>
            </View>
          )}
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>⭐ {item.rating}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[Typography.h4, { color: Colors.textPrimary }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text
            style={[
              Typography.caption,
              { color: Colors.textSecondary, marginVertical: Spacing.xs },
            ]}
            numberOfLines={2}
          >
            {item.description}
          </Text>

          <View style={styles.footer}>
            <Text style={[Typography.button, { color: Colors.primary }]}>
              ₹{item.price}
            </Text>
            <View style={styles.timeTag}>
              <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
                🕐 {item.time}
              </Text>
            </View>
          </View>
        </View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    height: 280,
    ...Shadows.md,
  },
  imageContainer: {
    height: 120,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundSecondary,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  emoji: {
    fontSize: 48,
  },
  discountTag: {
    position: "absolute",
    top: Spacing.md,
    left: Spacing.md,
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  discountText: {
    color: Colors.textPrimary,
    fontWeight: "700",
    fontSize: 14,
  },
  ratingBadge: {
    position: "absolute",
    bottom: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.textPrimary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
  },
  ratingText: {
    color: Colors.card,
    fontWeight: "600",
    fontSize: 12,
  },
  content: {
    padding: Spacing.md,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  timeTag: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
});
