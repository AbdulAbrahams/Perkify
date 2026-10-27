import { Ionicons } from "@expo/vector-icons";
import { Switch, StyleSheet, Text, View } from "react-native";
import type { ThemeColors } from "../../theme/colors";

export function SettingsToggle({
  icon,
  label,
  value,
  onValueChange,
  palette,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  palette: ThemeColors;
}) {
  return (
    <View style={[styles.row, { borderBottomColor: palette.border }]}>
      <Ionicons name={icon} size={19} color={palette.tint} />
      <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ false: palette.border, true: palette.tint }} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 51, flexDirection: "row", alignItems: "center", gap: 11, borderBottomWidth: StyleSheet.hairlineWidth },
  label: { flex: 1, fontSize: 13, fontWeight: "500" },
});
