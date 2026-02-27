import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors } from "../../src/constants/colors";
import { Spacing, BorderRadius, Shadows } from "../../src/constants/spacing";
import { Typography } from "../../src/constants/fonts";
import SearchBar from "../../src/components/SearchBar";
import PremiumCard from "../../src/components/PremiumCard";
import FeaturedCard from "../../src/components/FeaturedCard";
import { useSearch } from "../../src/hooks/useMenu";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { results, loading } = useSearch(searchQuery);

  const renderResult = ({ item, index }: { item: any; index: number }) => (
    <PremiumCard key={item.id} style={styles.resultCard} delay={index * 50}>
      <TouchableOpacity 
        style={styles.resultContent}
        onPress={() => router.push(`/product-detail?id=${item.id}`)}
        activeOpacity={0.7}
      >
        <View style={styles.resultImage}>
          <Text style={styles.imagePlaceholder}>{item.emoji}</Text>
        </View>
        <View style={styles.resultInfo}>
          <Text style={[Typography.body, { color: Colors.textPrimary }]}>
            {item.name}
          </Text>
          <Text
            style={[
              Typography.caption,
              { color: Colors.textSecondary, marginTop: Spacing.xs },
            ]}
            numberOfLines={1}
          >
            {item.category}
          </Text>
          <View style={styles.resultFooter}>
            <Text style={[Typography.button, { color: Colors.primary }]}>
              ₹{item.price}
            </Text>
            <View style={styles.ratingBadge}>
              <Ionicons
                name="star"
                size={12}
                color={Colors.textPrimary}
                style={{ marginRight: 2 }}
              />
              <Text style={[Typography.caption, { color: Colors.textPrimary }]}>
                {item.rating}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </PremiumCard>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <Text style={[Typography.h2, { color: Colors.textPrimary }]}>
            Search
          </Text>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search items..."
            style={{ marginTop: Spacing.lg }}
          />
        </Animated.View>

        {searchQuery.length === 0 ? (
          <View style={styles.emptySearch}>
            <Text style={{ fontSize: 48 }}>🔍</Text>
            <Text style={[Typography.h4, { color: Colors.textPrimary, marginTop: Spacing.lg }]}>
              Start searching
            </Text>
            <Text style={[Typography.bodySmall, { color: Colors.textSecondary, marginTop: Spacing.md, textAlign: "center" }]}>
              Find your favorite items by name or category
            </Text>
          </View>
        ) : loading ? (
          <View style={styles.emptySearch}>
            <Text style={{ fontSize: 48 }}>⏳</Text>
            <Text style={[Typography.h4, { color: Colors.textPrimary, marginTop: Spacing.lg }]}>
              Searching...
            </Text>
          </View>
        ) : results.length > 0 ? (
          <View style={styles.resultsContainer}>
            <Text
              style={[
                Typography.h4,
                { color: Colors.textPrimary, marginBottom: Spacing.md },
              ]}
            >
              Results ({results.length})
            </Text>
            <FlatList
              data={results}
              renderItem={renderResult}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              nestedScrollEnabled={false}
            />
          </View>
        ) : (
          <View style={styles.emptySearch}>
            <Text style={{ fontSize: 48 }}>😕</Text>
            <Text style={[Typography.h4, { color: Colors.textPrimary, marginTop: Spacing.lg }]}>
              No results found
            </Text>
            <Text style={[Typography.bodySmall, { color: Colors.textSecondary, marginTop: Spacing.md, textAlign: "center" }]}>
              Try searching for different keywords
            </Text>
          </View>
        )}
      </ScrollView>
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
  emptySearch: {
    alignItems: "center",
    paddingVertical: Spacing.xl * 2,
  },
  resultsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  resultCard: {
    marginBottom: Spacing.md,
  },
  resultContent: {
    flexDirection: "row",
    gap: Spacing.md,
    alignItems: "center",
  },
  resultImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholder: {
    fontSize: 32,
  },
  resultInfo: {
    flex: 1,
  },
  resultFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
});
