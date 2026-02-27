import React from "react";
import { ViewProps } from "react-native";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";

interface Props extends ViewProps {
  type?: "up" | "down";
  delay?: number;
}

export default function AnimatedView({ children, type = "up", delay = 0, style, ...rest }: Props) {
  const entering = type === "up" ? FadeInUp.delay(delay) : FadeInDown.delay(delay);
  return (
    <Animated.View entering={entering} style={style} {...rest}>
      {children}
    </Animated.View>
  );
}
