import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { Spacing, BorderRadius } from "../constants/spacing";

interface AnimatedCartButtonProps {
  onPress: () => void;
  quantity?: number;
  size?: "sm" | "md" | "lg";
}

export default function AnimatedCartButton({
  onPress,
  quantity = 0,
  size = "md",
}: AnimatedCartButtonProps) {
  const scale = useSharedValue(1);
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    scale.value = withSpring(1.2, { damping: 6, mass: 1 });
    setLoading(true);
    onPress();
    setTimeout(() => setLoading(false), 600);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 48,
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={loading}
        style={[styles.button, { width: sizeMap[size], height: sizeMap[size] }]}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color={Colors.background} size={iconSize[size]} />
        ) : (
          <>
            <Ionicons
              name="add"
              size={iconSize[size]}
              color={Colors.background}
              style={styles.icon}
            />
            {quantity > 0 && (
              <View style={styles.badge}>
                <Animated.Text style={styles.badgeText}>{quantity}</Animated.Text>
              </View>
            )}
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontWeight: "bold",
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.full,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: Colors.textPrimary,
    fontWeight: "600",
    fontSize: 12,
  },
});
