import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import Animated, { FadeInDown, FadeIn, FadeOut } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../src/constants/colors";
import { Spacing, BorderRadius, Shadows } from "../src/constants/spacing";
import { Typography } from "../src/constants/fonts";
import PremiumButton from "../src/components/PremiumButton";
import { useUser } from "../src/store/UserContext";
import { api } from "../src/services/api";

type LoginStep = "phone" | "otp";

export default function LoginScreen() {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const { setUser } = useUser();

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }
    setIsLoading(true);
    try {
      let formattedPhone = phone.trim();
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+91' + formattedPhone.replace(/^0+/, '');
      }
      const response = await api.sendOTP(formattedPhone);
      setPhone(formattedPhone);
      
      // Show OTP in notification
      if (response.otp) {
        setDemoOtp(response.otp);
        setTimeout(() => setDemoOtp(null), 5000);
      }
      
      setStep("otp");
    } catch (error: any) {
      alert(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 6) {
      alert("Please enter a valid OTP");
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.verifyOTP(phone, otp);
      setUser(response.user);
      setDemoOtp(null);
      router.replace("/(tabs)");
    } catch (error) {
      alert("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Demo OTP Notification */}
      {demoOtp && (
        <Animated.View 
          entering={FadeInDown.duration(400)}
          exiting={FadeOut.duration(300)}
          style={styles.otpNotification}
        >
          <View style={styles.otpNotificationHeader}>
            <View style={styles.otpNotificationIcon}>
              <Ionicons name="lock-closed" size={16} color={Colors.primary} />
            </View>
            <View style={styles.otpNotificationHeaderText}>
              <Text style={styles.otpNotificationApp}>Akbar Cafe</Text>
              <Text style={styles.otpNotificationTime}>now</Text>
            </View>
            <TouchableOpacity onPress={() => setDemoOtp(null)}>
              <Ionicons name="close" size={20} color={Colors.textTertiary} />
            </TouchableOpacity>
          </View>
          <View style={styles.otpNotificationBody}>
            <Text style={styles.otpNotificationMessage}>Your verification code is</Text>
            <Text style={styles.otpNotificationCode}>{demoOtp}</Text>
            <Text style={styles.otpNotificationFooter}>Valid for 10 minutes</Text>
          </View>
        </Animated.View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero Section */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/images/logo.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Welcome to Akbar Cafe</Text>
          <Text style={styles.subtitle}>
            {step === "phone" 
              ? "Enter your phone number to get started"
              : "Enter the verification code we sent"}
          </Text>
        </Animated.View>

        {/* Phone Input Step */}
        {step === "phone" && (
          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.formSection}>
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <Ionicons name="call-outline" size={20} color={Colors.primary} />
              </View>
              <TextInput
                placeholder="Enter phone number"
                placeholderTextColor={Colors.textTertiary}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoFocus
                style={styles.input}
              />
            </View>
            <Text style={styles.helperText}>
              <Ionicons name="shield-checkmark" size={14} color={Colors.success} />
              {" "}We'll send you a 6-digit OTP
            </Text>

            <PremiumButton
              title={isLoading ? "Sending..." : "Send OTP"}
              onPress={handleSendOTP}
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading || phone.length < 10}
              style={styles.primaryButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>New here?</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => router.replace("/register")}
            >
              <Text style={styles.secondaryButtonText}>Create Account</Text>
              <Ionicons name="arrow-forward" size={18} color={Colors.primary} />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* OTP Input Step */}
        {step === "otp" && (
          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.formSection}>
            <View style={styles.otpInfo}>
              <Ionicons name="mail-outline" size={24} color={Colors.primary} />
              <Text style={styles.otpInfoText}>
                Code sent to <Text style={styles.phoneNumber}>{phone}</Text>
              </Text>
            </View>

            <View style={styles.otpInputContainer}>
              <TextInput
                placeholder="000000"
                placeholderTextColor={Colors.textTertiary}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                autoFocus
                style={styles.otpInput}
                maxLength={6}
              />
            </View>

            <PremiumButton
              title={isLoading ? "Verifying..." : "Verify & Login"}
              onPress={handleVerifyOTP}
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading || otp.length < 6}
              style={styles.primaryButton}
            />

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code?</Text>
              <TouchableOpacity onPress={() => setStep("phone")}>
                <Text style={styles.resendLink}>Change Number</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Trust Indicators */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.trustSection}>
          <View style={styles.trustItem}>
            <Ionicons name="lock-closed" size={16} color={Colors.success} />
            <Text style={styles.trustText}>Secure & Encrypted</Text>
          </View>
          <View style={styles.trustItem}>
            <Ionicons name="time" size={16} color={Colors.success} />
            <Text style={styles.trustText}>Quick Login</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xl,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: Spacing.xxxl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.xxl,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
    ...Shadows.lg,
    overflow: "hidden",
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.sm,
    fontWeight: "700",
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: Spacing.xl,
  },
  formSection: {
    marginBottom: Spacing.xl,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  inputIconContainer: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    height: 56,
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  helperText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.xs,
  },
  primaryButton: {
    marginTop: Spacing.md,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginHorizontal: Spacing.md,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  secondaryButtonText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: "600",
  },
  otpInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  otpInfoText: {
    ...Typography.body,
    color: Colors.textSecondary,
    flex: 1,
  },
  phoneNumber: {
    color: Colors.primary,
    fontWeight: "700",
  },
  otpInputContainer: {
    marginBottom: Spacing.lg,
  },
  otpInput: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    height: 72,
    fontSize: 32,
    fontWeight: "700",
    color: Colors.textPrimary,
    textAlign: "center",
    letterSpacing: 12,
    ...Shadows.md,
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.lg,
    gap: Spacing.xs,
  },
  resendText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  resendLink: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: "600",
  },
  trustSection: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.xl,
    marginTop: Spacing.xl,
    paddingTop: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  trustItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  trustText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  otpNotification: {
    position: "absolute",
    top: 50,
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 1000,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    ...Shadows.lg,
    overflow: "hidden",
  },
  otpNotificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F8F9FA",
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
    gap: 10,
  },
  otpNotificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  otpNotificationHeaderText: {
    flex: 1,
  },
  otpNotificationApp: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  otpNotificationTime: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  otpNotificationBody: {
    padding: 16,
    alignItems: "center",
  },
  otpNotificationMessage: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  otpNotificationCode: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.primary,
    letterSpacing: 8,
    marginVertical: 4,
  },
  otpNotificationFooter: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 4,
  },
});
