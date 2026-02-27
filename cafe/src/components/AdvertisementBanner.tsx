import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ImageSourcePropType } from "react-native";
import Animated, { FadeInOut } from "react-native-reanimated";
import { Colors } from "../constants/colors";
import { Spacing, BorderRadius } from "../constants/spacing";
import { Typography } from "../constants/fonts";

interface Advertisement {
  id: string;
  title: string;
  description: string;
  image?: ImageSourcePropType;
  bgColor: string;
  textColor: string;
}

const ADVERTISEMENTS: Advertisement[] = [
  {
    id: "1",
    title: "Special Offer",
    description: "Get 20% off on all beverages this week!",
    image: require("../../assets/images/react-logo.png"),
    bgColor: "#E8F5E9",
    textColor: "#2E7D32",
  },
  {
    id: "2",
    title: "New Arrival",
    description: "Try our delicious new dessert collection",
    image: require("../../assets/images/partial-react-logo.png"),
    bgColor: "#FFF3E0",
    textColor: "#E65100",
  },
  {
    id: "3",
    title: "Loyalty Rewards",
    description: "Earn points on every order and redeem them",
    image: require("../../assets/images/react-logo.png"),
    bgColor: "#F3E5F5",
    textColor: "#6A1B9A",
  },
  {
    id: "4",
    title: "Happy Hour",
    description: "50% discount on selected items 3-5 PM daily",
    image: require("../../assets/images/splash-icon.png"),
    bgColor: "#E3F2FD",
    textColor: "#0D47A1",
  },
];

export default function AdvertisementBanner() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ADVERTISEMENTS.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentAd = ADVERTISEMENTS[currentAdIndex];

  return (
    <Animated.View entering={FadeInOut} style={styles.container}>
      <View
        style={[
          styles.banner,
          { backgroundColor: currentAd.bgColor },
        ]}
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: currentAd.textColor }]}> 
            {currentAd.title}
          </Text>
          <Text style={[styles.description, { color: currentAd.textColor }]}> 
            {currentAd.description}
          </Text>
        </View>

        {currentAd.image && (
          <Image source={currentAd.image} style={styles.image} resizeMode="contain" />
        )}

        <View style={[styles.indicator]}>
          {ADVERTISEMENTS.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentAdIndex
                      ? currentAd.textColor
                      : currentAd.textColor + "40",
                },
              ]}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  banner: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    minHeight: 100,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    marginBottom: Spacing.md,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  indicator: {
    flexDirection: "row",
    gap: Spacing.xs,
    justifyContent: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  image: {
    width: 96,
    height: 72,
    marginLeft: Spacing.md,
    opacity: 0.95,
  },
});
