import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";
import { Colors, type ThemeColors } from "../../theme/colors";

export function MenuRow({
  icon,
  label,
  palette,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  palette: ThemeColors;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.row, { borderBottomColor: palette.border }]} onPress={onPress}>
      <Ionicons name={icon} size={19} color={palette.tint || palette.brandPrimary} />
      <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={17} color={palette.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 51, flexDirection: "row", alignItems: "center", gap: 11, borderBottomWidth: StyleSheet.hairlineWidth },
  label: { flex: 1, fontSize: 13, fontWeight: "500" },
});
