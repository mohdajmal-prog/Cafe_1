import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Colors } from "../constants/colors";
import { Spacing, BorderRadius } from "../constants/spacing";
import { Typography } from "../constants/fonts";
import FeaturedCard from "./FeaturedCard";
import { MenuItem } from "../services/types";

interface FeaturedSectionProps {
  items: MenuItem[];
  onItemPress?: (item: MenuItem) => void;
  loading?: boolean;
  enableNavigation?: boolean;
}

export default function FeaturedSection({
  items,
  onItemPress,
  loading = false,
  enableNavigation = true,
}: FeaturedSectionProps) {
  const renderItem = ({ item, index }: { item: MenuItem; index: number }) => (
    <View style={styles.itemContainer}>
      <FeaturedCard 
        item={item} 
        onPress={onItemPress ? () => onItemPress(item) : undefined} 
        delay={index * 100}
        enableNavigation={enableNavigation}
      />
    </View>
  );

  return (
    <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.container}>
      <View style={styles.header}>
        <Text style={[Typography.h3, { color: Colors.textPrimary }]}>
          Popular Now 🔥
        </Text>
        <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
          Most ordered items
        </Text>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        scrollEnabled={false}
        nestedScrollEnabled={false}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  columnWrapper: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  itemContainer: {
    flex: 1,
  },
});
