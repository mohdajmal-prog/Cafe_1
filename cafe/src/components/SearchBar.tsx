import { View, TextInput, StyleSheet, StyleProp, ViewStyle } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Colors } from "../constants/colors";
import { Spacing } from "../constants/spacing";

interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
}

export default function SearchBar({ value, onChangeText, placeholder = "Search snacks, drinks...", style }: SearchBarProps) {
  return (
    <Animated.View entering={FadeInDown.duration(600)} style={[styles.container, style]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={Colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  input: {
    backgroundColor: Colors.card,
    padding: Spacing.md,
    borderRadius: 14,
    color: Colors.textPrimary,
    fontSize: 16,
  },
});
