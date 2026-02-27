import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from "react-native-reanimated";
import { Colors } from "../constants/colors";
import { Spacing, BorderRadius } from "../constants/spacing";

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
}

export default function SkeletonLoader({
  width = "100%",
  height = 20,
  borderRadius: radius = BorderRadius.md,
}: SkeletonLoaderProps) {
  const opacity = useSharedValue(0.6);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          // Animated style typing is strict; cast to any here to accept both string and number widths
          width: width as any,
          height: height as any,
          borderRadius: radius as any,
        },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Colors.skeleton,
  },
});
