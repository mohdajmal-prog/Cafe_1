import React, { createContext, useContext, useState, useCallback } from "react";

type ThemeType = "light" | "dark";

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  colors: {
    background: string;
    backgroundSecondary: string;
    card: string;
    cardHover: string;
    primary: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    accent: string;
    success: string;
    error: string;
    warning: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    borderLight: string;
    skeleton: string;
    // Convenient aliases
    text: string;
    placeholder: string;
    cardBackground: string;
    inputBackground: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const lightColors = {
  background: "#FFFFFF",
  backgroundSecondary: "#F9FAFB",
  card: "#F3F4F6",
  cardHover: "#E5E7EB",
  primary: "#DC2626",
  primaryDark: "#B91C1C",
  primaryLight: "#EF4444",
  secondary: "#EC4899",
  accent: "#DC2626",
  success: "#10B981",
  error: "#EF4444",
  warning: "#FBBF24",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  textTertiary: "#9CA3AF",
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  skeleton: "#E5E7EB",
  // Convenient aliases
  text: "#111827",
  placeholder: "#9CA3AF",
  cardBackground: "#F3F4F6",
  inputBackground: "#F9FAFB",
};

const darkColors = {
  background: "#000000",
  backgroundSecondary: "#1F2937",
  card: "#374151",
  cardHover: "#4B5563",
  primary: "#DC2626",
  primaryDark: "#B91C1C",
  primaryLight: "#EF4444",
  secondary: "#EC4899",
  accent: "#DC2626",
  success: "#10B981",
  error: "#EF4444",
  warning: "#FBBF24",
  textPrimary: "#FFFFFF",
  textSecondary: "#D1D5DB",
  textTertiary: "#9CA3AF",
  border: "#4B5563",
  borderLight: "#6B7280",
  skeleton: "#4B5563",
  // Convenient aliases
  text: "#FFFFFF",
  placeholder: "#9CA3AF",
  cardBackground: "#374151",
  inputBackground: "#1F2937",
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>("light");

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const colors = theme === "light" ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
