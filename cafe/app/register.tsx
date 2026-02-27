import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Image } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../src/constants/colors";
import { Spacing, BorderRadius, Shadows } from "../src/constants/spacing";
import { Typography } from "../src/constants/fonts";
import PremiumButton from "../src/components/PremiumButton";
import { useUser } from "../src/store/UserContext";
import { User } from "../src/services/types";
import { api } from "../src/services/api";

type RegistrationStep = "phone" | "otp" | "details";

export default function RegisterScreen() {
  const router = useRouter();
  const { setUser } = useUser();
  const [step, setStep] = useState<RegistrationStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [demoOtp, setDemoOtp] = useState<string | null>(null);

  const handleSendOTP = async () => {
    if (phoneNumber.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.sendOTP(`+91${phoneNumber}`);
      if (response.otp) {
        setDemoOtp(response.otp);
        setTimeout(() => setDemoOtp(null), 5000);
      }
      setStep("otp");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }
    // Don't verify yet, just move to next step
    setStep("details");
  };

  const handleCompleteRegistration = async () => {
    if (!name.trim() || !email.trim()) {
      alert("Please fill in all details");
      return;
    }
    setIsLoading(true);
    try {
      // Now verify OTP with name and email to create/update user
      const response = await api.verifyOTP(`+91${phoneNumber}`, otp, name.trim(), email.trim());
      setUser(response.user);
      setDemoOtp(null);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error completing registration:", error);
      alert("Failed to complete registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/images/logo.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={[Typography.h2, { color: Colors.textPrimary, textAlign: "center" }]}>
            Afridh Cafe
          </Text>
          <Text style={[Typography.bodySmall, { color: Colors.textSecondary, textAlign: "center", marginTop: Spacing.sm }]}>
            Welcome! Let's get you started
          </Text>
        </View>

        <View style={styles.stepsContainer}>
          {[1, 2, 3].map((num) => (
            <View key={num} style={styles.stepWrapper}>
              <View style={[
                styles.stepIndicator,
                step === "details" || (step === "otp" && num <= 2) || (step === "phone" && num === 1) ? styles.stepComplete : undefined
              ]}>
                <Text style={styles.stepNumber}>{num}</Text>
              </View>
              {num < 3 && <View style={styles.stepLine} />}
            </View>
          ))}
        </View>

        {step === "phone" && (
          <View style={styles.formSection}>
            <Text style={[Typography.h4, { color: Colors.textPrimary, marginBottom: Spacing.lg }]}>
              Enter Your Phone Number
            </Text>
            <View style={styles.phoneInputContainer}>
              <Text style={styles.countryCode}>🇮🇳 +91</Text>
              <TextInput
                placeholder="Enter 10-digit number"
                placeholderTextColor={Colors.textSecondary}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                style={styles.phoneInput}
                maxLength={10}
              />
            </View>
            <Text style={[Typography.caption, { color: Colors.textSecondary, marginTop: Spacing.md }]}>
              We'll send you an OTP to verify your number
            </Text>

            <PremiumButton
              title={isLoading ? "Sending OTP..." : "Send OTP"}
              onPress={handleSendOTP}
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading || phoneNumber.length < 10}
              style={{ marginTop: Spacing.xl }}
            />

            <View style={styles.loginContainer}>
              <Text style={[Typography.body, { color: Colors.textSecondary }]}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.replace("/login")}>
                <Text style={[Typography.body, { color: Colors.primary, fontWeight: "600" }]}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === "otp" && (
          <View style={styles.formSection}>
            <Text style={[Typography.h4, { color: Colors.textPrimary, marginBottom: Spacing.lg }]}>
              Enter OTP
            </Text>
            <Text style={[Typography.bodySmall, { color: Colors.textSecondary, marginBottom: Spacing.lg }]}>
              We've sent a 6-digit OTP to +91 {phoneNumber}
            </Text>

            <TextInput
              placeholder="000000"
              placeholderTextColor={Colors.textSecondary}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              style={styles.otpInput}
              maxLength={6}
            />

            <TouchableOpacity onPress={() => setStep("phone")} style={styles.resendContainer}>
              <Text style={[Typography.caption, { color: Colors.primary }]}>
                Didn't receive? Change Number
              </Text>
            </TouchableOpacity>

            <PremiumButton
              title={isLoading ? "Verifying..." : "Verify OTP"}
              onPress={handleVerifyOTP}
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading || otp.length < 6}
              style={{ marginTop: Spacing.xl }}
            />
          </View>
        )}

        {step === "details" && (
          <View style={styles.formSection}>
            <Text style={[Typography.h4, { color: Colors.textPrimary, marginBottom: Spacing.lg }]}>
              Complete Your Profile
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[Typography.caption, { color: Colors.textSecondary, marginBottom: Spacing.sm }]}>
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

            <View style={[styles.inputGroup, { marginTop: Spacing.lg }]}>
              <Text style={[Typography.caption, { color: Colors.textSecondary, marginBottom: Spacing.sm }]}>
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

            <View style={[styles.inputGroup, { marginTop: Spacing.lg }]}>
              <Text style={[Typography.caption, { color: Colors.textSecondary, marginBottom: Spacing.sm }]}>
                Phone Number
              </Text>
              <View style={[styles.textInput, { justifyContent: "center" }]}>
                <Text style={[Typography.body, { color: Colors.textPrimary }]}>
                  🇮🇳 +91 {phoneNumber}
                </Text>
              </View>
            </View>

            <PremiumButton
              title={isLoading ? "Creating Account..." : "Create Account"}
              onPress={handleCompleteRegistration}
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading || !name.trim() || !email.trim()}
              style={{ marginTop: Spacing.xl }}
            />
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
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: Spacing.xl * 2,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
    overflow: "hidden",
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl * 2,
  },
  stepWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.border,
  },
  stepComplete: {
    backgroundColor: Colors.primary + "20",
    borderColor: Colors.primary,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  stepLine: {
    width: 20,
    height: 2,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.sm,
  },
  formSection: {
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 50,
  },
  countryCode: {
    fontSize: 14,
    marginRight: Spacing.md,
    color: Colors.textPrimary,
  },
  phoneInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "500",
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
  },
  otpInput: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    height: 60,
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textPrimary,
    textAlign: "center",
    letterSpacing: 8,
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.xl,
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
