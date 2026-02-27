import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "../src/constants/colors";
import { Spacing, BorderRadius, Shadows } from "../src/constants/spacing";
import { Typography } from "../src/constants/fonts";
import PremiumButton from "../src/components/PremiumButton";
import { useUser } from "../src/store/UserContext";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatarUri, setAvatarUri] = useState<string | null>(user?.avatar || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photos');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    setIsLoading(true);
    try {
      // Save to backend
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://10.181.194.35:3006'}/user/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await require('expo-secure-store').getItemAsync('authToken')}`
        },
        body: JSON.stringify({ name: name.trim(), email: email.trim() || undefined })
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const updatedUser = await response.json();
      
      // Update user context
      if (setUser) {
        setUser(updatedUser);
      }

      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        router.back();
      }, 1500);
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[Typography.h2, { color: Colors.textPrimary, flex: 1 }]}>
            Edit Profile
          </Text>
        </Animated.View>

        {/* Profile Avatar */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.avatarSection}>
          <View style={styles.avatar}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.editAvatarButton} onPress={pickImage}>
            <Ionicons name="camera" size={16} color={Colors.background} />
          </TouchableOpacity>
          <Text style={[Typography.caption, { color: Colors.textSecondary, marginTop: Spacing.md }]}>
            Tap to change photo
          </Text>
        </Animated.View>

        {/* Form */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.formSection}>
          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={[Typography.caption, { color: Colors.textSecondary, marginBottom: Spacing.sm, fontWeight: "bold" }]}>
              Full Name
            </Text>
            <TextInput
              placeholder="Enter your full name"
              placeholderTextColor={Colors.textSecondary}
              value={name}
              onChangeText={setName}
              style={styles.textInput}
            />
          </View>

          {/* Email */}
          <View style={[styles.inputGroup, { marginTop: Spacing.lg }]}>
            <Text style={[Typography.caption, { color: Colors.textSecondary, marginBottom: Spacing.sm, fontWeight: "600" }]}>
              Email Address
            </Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor={Colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.textInput}
            />
          </View>

          {/* Phone (Read-only) */}
          <View style={[styles.inputGroup, { marginTop: Spacing.lg }]}>
            <Text style={[Typography.caption, { color: Colors.textSecondary, marginBottom: Spacing.sm, fontWeight: "600" }]}>
              Phone Number
            </Text>
            <View style={[styles.textInput, { justifyContent: "center", opacity: 0.6 }]}>
              <Text style={[Typography.body, { color: Colors.textPrimary }]}>
                🇮🇳 {phone}
              </Text>
            </View>
            <Text style={[Typography.caption, { color: Colors.textSecondary, marginTop: Spacing.sm }]}>
              Cannot be changed
            </Text>
          </View>

          {/* Member Since */}
          <View style={[styles.infoCard, { marginTop: Spacing.lg }]}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={20} color={Colors.primary} />
              <View style={{ marginLeft: Spacing.md, flex: 1 }}>
                <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
                  Member Since
                </Text>
                <Text style={[Typography.body, { color: Colors.textPrimary, marginTop: Spacing.xs }]}>
                  Jan 29, 2026
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.buttonSection}>
          <PremiumButton
            title={isLoading ? "Saving..." : isSaved ? "Saved! ✓" : "Save Changes"}
            onPress={handleSaveProfile}
            variant="primary"
            size="lg"
            fullWidth
            disabled={isLoading || isSaved}
          />
          <PremiumButton
            title="Cancel"
            onPress={() => router.back()}
            variant="secondary"
            size="lg"
            fullWidth
            disabled={isLoading}
          />
        </Animated.View>
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.md,
  },
  avatarText: {
    fontSize: 44,
    fontWeight: "700",
    color: Colors.background,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: "25%",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.sm,
  },
  formSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  textInput: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 50,
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "500",
  },
  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  buttonSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl * 2,
  },
});
