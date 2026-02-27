import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { Colors } from "../constants/colors";
import { Spacing, BorderRadius, Shadows } from "../constants/spacing";
import { Typography } from "../constants/fonts";
import { Category } from "../services/types";

interface CategoryChipProps {
  item: Category;
  isSelected?: boolean;
  onPress: () => void;
  delay?: number;
}

export default function CategoryChip({
  item,
  isSelected = false,
  onPress,
  delay = 0,
}: CategoryChipProps) {
  return (
    <Animated.View entering={FadeInRight.delay(delay).duration(400)}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[
          styles.chip,
          isSelected && styles.chipSelected,
        ]}
      >
        <Text style={styles.emoji}>{item.icon}</Text>
        <Text
          style={[
            Typography.caption,
            {
              color: isSelected ? Colors.textPrimary : Colors.textSecondary,
              marginTop: Spacing.xs,
              fontWeight: isSelected ? "600" : "400",
            },
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    width: 70,
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundSecondary,
    ...Shadows.sm,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
  },
  emoji: {
    fontSize: 28,
  },
});
