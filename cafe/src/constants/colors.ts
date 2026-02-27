// Professional Color System with semantic naming
export const Colors = {
  // Backgrounds
  background: "#FFFFFF",
  backgroundSecondary: "#F8F9FA",
  backgroundTertiary: "#F1F3F5",
  
  // Cards & Surfaces
  card: "#FFFFFF",
  cardElevated: "#FFFFFF",
  cardHover: "#F8F9FA",
  
  // Brand Colors
  primary: "#DC2626",
  primaryDark: "#B91C1C",
  primaryLight: "#FEE2E2",
  primaryGradientStart: "#DC2626",
  primaryGradientEnd: "#B91C1C",
  
  // Secondary & Accent
  secondary: "#1F2937",
  accent: "#F59E0B",
  accentLight: "#FEF3C7",
  
  // Status Colors
  success: "#10B981",
  successLight: "#D1FAE5",
  error: "#EF4444",
  errorLight: "#FEE2E2",
  warning: "#F59E0B",
  warningLight: "#FEF3C7",
  info: "#3B82F6",
  infoLight: "#DBEAFE",
  
  // Text Colors
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  textTertiary: "#9CA3AF",
  textDisabled: "#D1D5DB",
  textInverse: "#FFFFFF",
  
  // Borders
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  borderDark: "#D1D5DB",
  
  // Overlays
  overlay: "rgba(0, 0, 0, 0.5)",
  overlayLight: "rgba(0, 0, 0, 0.3)",
  
  // Skeleton
  skeleton: "#E5E7EB",
  skeletonHighlight: "#F3F4F6",
};

// Extended palette for theming
export const Palettes = {
  light: {
    bg: Colors.background,
    card: Colors.card,
    text: Colors.textPrimary,
  },
  dark: {
    bg: "#111827",
    card: "#1F2937",
    text: "#F9FAFB",
  },
};
