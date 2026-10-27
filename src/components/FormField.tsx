import { useState, type ReactNode } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, type KeyboardTypeOptions } from "react-native";
import type { ThemeColors } from "../../theme/colors";

type FormFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  palette: ThemeColors;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  rightAction?: ReactNode;
};

export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  palette,
  keyboardType = "default",
  secureTextEntry = false,
  autoCapitalize,
  rightAction,
}: FormFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const canTogglePassword = secureTextEntry && !rightAction;

  return (
    <View style={styles.group}>
      <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
      <View style={[styles.inputWrap, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <TextInput
          style={[styles.input, { color: palette.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={palette.textSecondary}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          autoCapitalize={autoCapitalize ?? (keyboardType === "email-address" ? "none" : "sentences")}
        />
        {canTogglePassword ? (
          <Pressable accessibilityRole="button" onPress={() => setIsPasswordVisible((visible) => !visible)}>
            <Text style={{ color: palette.textSecondary }}>{isPasswordVisible ? "Hide" : "Show"}</Text>
          </Pressable>
        ) : rightAction}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 7 },
  inputWrap: { minHeight: 48, borderWidth: 1, borderRadius: 12, paddingHorizontal: 13, flexDirection: "row", alignItems: "center" },
  input: { flex: 1, fontSize: 14, paddingVertical: 11 },
});
