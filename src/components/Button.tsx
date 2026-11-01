import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { Colors, type ThemeColors } from "../../theme/colors";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  disabled?: boolean;
  loading?: boolean;
  palette: ThemeColors; // Made required so it always gets the theme colors
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
        primary && { backgroundColor: palette.brandPrimary },
        variant === "secondary" && { backgroundColor: palette.surface },
        variant === "outline" && { borderWidth: 1, borderColor: palette.border },
        danger && { borderWidth: 1, borderColor: Colors.danger },
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={primary ? "#FFFFFF" : danger ? Colors.danger : palette.text} />
      ) : (
        <Text 
          style={[
            styles.label, 
            primary && styles.primaryLabel, 
            danger && styles.dangerLabel, 
            !primary && !danger && { color: palette.text }
          ]}
        >
          {title}
        </Text>
      )}
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
  label: { 
    fontSize: 15, 
    fontWeight: "700" 
  },
  primaryLabel: { 
    color: "#FFFFFF" 
  },
  dangerLabel: { 
    color: Colors.danger 
  },
  disabled: { 
    opacity: 0.55 
  },
});