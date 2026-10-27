import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { Colors, type ThemeColors } from "../../theme/colors";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  disabled?: boolean;
  loading?: boolean;
  palette?: ThemeColors;
};

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  palette,
}: ButtonProps) {
  const primary = variant === "primary";
  const danger = variant === "danger";
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.button,
        primary && styles.primary,
        variant === "secondary" && [styles.secondary, palette && { backgroundColor: palette.surface }],
        variant === "outline" && [styles.outline, palette && { borderColor: palette.border }],
        danger && [styles.danger, palette && { borderColor: palette.border }],
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading
        ? <ActivityIndicator color={primary ? "#FFFFFF" : Colors.brandPrimary} />
        : <Text style={[styles.label, primary && styles.primaryLabel, danger && styles.dangerLabel, !primary && !danger && palette && { color: palette.text }]}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  primary: { backgroundColor: Colors.brandPrimary },
  secondary: { backgroundColor: "#F4F4F4" },
  outline: { borderWidth: 1, borderColor: "#E0E0E0" },
  danger: { borderWidth: 1, borderColor: Colors.danger },
  label: { color: Colors.brandPrimary, fontSize: 15, fontWeight: "700" },
  primaryLabel: { color: "#FFFFFF" },
  dangerLabel: { color: Colors.danger },
  disabled: { opacity: 0.55 },
});
