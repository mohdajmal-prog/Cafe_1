import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors } from "../../src/constants/colors";
import { Spacing, BorderRadius, Shadows } from "../../src/constants/spacing";
import { Typography } from "../../src/constants/fonts";
import PremiumCard from "../../src/components/PremiumCard";
import PremiumButton from "../../src/components/PremiumButton";
import { useUser } from "../../src/store/UserContext";
import { useTheme } from "../../src/store/ThemeContext";

export default function AccountScreen() {
  const router = useRouter();
  const { user, logout } = useUser();
  const { theme, colors, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            logout();
            router.replace("/login");
          },
        },
      ]
    );
  };

  const handleMenuItemPress = (label: string) => {
    switch (label) {
      case "Edit Profile":
        router.push("/edit-profile");
        break;
      case "Payment Methods":
        console.log("Payment Methods tapped");
        alert("Payment Methods - Manage your saved cards and wallets");
        break;
      case "My Rewards":
        console.log("My Rewards tapped");
        alert("My Rewards - You have 450 loyalty points!");
        break;
      case "Offers & Promos":
        console.log("Offers & Promos tapped");
        alert("Offers & Promos - Check current deals and discounts");
        break;
      case "Help & Support":
        console.log("Help & Support tapped");
        alert("Help & Support - Contact us for assistance");
        break;
      case "About":
        console.log("About tapped");
        alert("About - Ambis Cafe v1.0\n\nYour favorite premium cafe ordering app!");
        break;
      default:
        break;
    }
  };

  const menuItems = [
    { icon: "person", label: "Edit Profile", onPress: () => handleMenuItemPress("Edit Profile") },
    { icon: "card", label: "Payment Methods", onPress: () => handleMenuItemPress("Payment Methods") },
    { icon: "cash", label: "My Refund", onPress: () => handleMenuItemPress("My Refund") },
    { icon: "gift", label: "Offers & Promos", onPress: () => handleMenuItemPress("Offers & Promos") },
    { icon: "help-circle", label: "Help & Support", onPress: () => handleMenuItemPress("Help & Support") },
    { icon: "information-circle", label: "About", onPress: () => handleMenuItemPress("About") },
  ];

  const renderMenuItem = ({ icon, label, onPress }: any) => (
    <TouchableOpacity
      key={label}
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIcon}>
          <Ionicons name={icon as any} size={20} color={Colors.primary} />
        </View>
        <Text style={[Typography.body, { color: Colors.textPrimary }]}>
          {label}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <Text style={[Typography.h2, { color: colors.textPrimary }]}>
            Account
          </Text>
        </Animated.View>

        {/* Profile Card */}
        <PremiumCard style={styles.profileCard} delay={100}>
          <View style={styles.profileContent}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[Typography.h3, { color: Colors.textPrimary }]}>
                {user?.name}
              </Text>
              <Text
                style={[
                  Typography.bodySmall,
                  { color: Colors.textSecondary, marginTop: Spacing.xs },
                ]}
              >
                {user?.email}
              </Text>
              <Text
                style={[
                  Typography.caption,
                  { color: Colors.primary, marginTop: Spacing.xs },
                ]}
              >
                {user?.phone}
              </Text>
            </View>
          </View>
        </PremiumCard>

        {/* Stats Card */}
        <View style={styles.statsContainer}>
          <PremiumCard style={styles.statCard} delay={150}>
            <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
              Total Orders
            </Text>
            <Text style={[Typography.h2, { color: Colors.primary }]}>12</Text>
          </PremiumCard>
        </View>

        {/* Preferences */}
        <PremiumCard style={styles.preferencesCard} delay={250}>
          <Text
            style={[
              Typography.h4,
              { color: Colors.textPrimary, marginBottom: Spacing.md },
            ]}
          >
            Preferences
          </Text>

          {/* Notifications */}
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <Ionicons name="notifications" size={20} color={Colors.primary} />
              <Text style={[Typography.body, { color: Colors.textPrimary }]}>
                Notifications
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.border, true: Colors.primary + "40" }}
              thumbColor={notifications ? Colors.primary : Colors.textSecondary}
            />
          </View>

          {/* Dark Mode */}
          <View style={[styles.preferenceItem, { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: Spacing.md, marginTop: Spacing.md }]}>
            <View style={styles.preferenceLeft}>
              <Ionicons name="moon" size={20} color={colors.primary} />
              <View style={styles.darkModeInfo}>
                <Text style={[Typography.body, { color: colors.textPrimary }]}>
                  Dark Mode
                </Text>
                <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                  {theme === "dark" ? "Enabled" : "Disabled"}
                </Text>
              </View>
            </View>
            <Switch
              value={theme === "dark"}
              onValueChange={(value) => {
                toggleTheme();
                alert(value ? "Dark Mode Enabled ✓" : "Light Mode Enabled ✓");
              }}
              trackColor={{ false: colors.border, true: colors.primary + "40" }}
              thumbColor={theme === "dark" ? colors.primary : colors.textSecondary}
            />
          </View>
        </PremiumCard>

        {/* Menu Items */}
        <PremiumCard style={styles.menuCard} delay={300}>
          {menuItems.map((item) => renderMenuItem(item))}
        </PremiumCard>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <PremiumButton
            title="Logout"
            onPress={handleLogout}
            variant="secondary"
            fullWidth
          />
        </View>
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


  profileCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.background,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
  },
  preferencesCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  preferenceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  preferenceLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    flex: 1,
  },
  darkModeInfo: {
    marginLeft: Spacing.sm,
  },
  menuCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
});
