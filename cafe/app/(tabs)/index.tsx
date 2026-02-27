import { View, ScrollView, StyleSheet, RefreshControl, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Colors } from "../../src/constants/colors";
import { Spacing, BorderRadius, Shadows } from "../../src/constants/spacing";
import { Typography } from "../../src/constants/fonts";
import LuxuryHeader from "../../src/components/LuxuryHeader";
import SearchBar from "../../src/components/SearchBar";
import AdvertisementBanner from "../../src/components/AdvertisementBanner";
import FeaturedSection from "../../src/components/FeaturedSection";
import SkeletonLoader from "../../src/components/SkeletonLoader";
import { useMenuItems } from "../../src/hooks/useMenu";
import { useState } from "react";

export default function HomeScreen() {
  const { items, loading, refetch } = useMenuItems();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesSearch;
  });

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={true}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        <LuxuryHeader />
        
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <AdvertisementBanner />

        {/* Featured Items */}
        {loading ? (
          <View style={styles.loadingSection}>
            <SkeletonLoader width="100%" height={200} borderRadius={BorderRadius.lg} />
            <View style={{ height: Spacing.md }} />
            <SkeletonLoader width="100%" height={200} borderRadius={BorderRadius.lg} />
          </View>
        ) : filteredItems.length > 0 ? (
          <FeaturedSection items={filteredItems} enableNavigation={true} />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>🔍 No items found</Text>
            <Text style={styles.emptyStateSubtext}>Try a different search term</Text>
          </View>
        )}
        
        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  loadingSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.lg,
  },
  emptyStateText: {
    ...Typography.h3,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  emptyStateSubtext: {
    ...Typography.body,
    color: Colors.textTertiary,
  },
});
