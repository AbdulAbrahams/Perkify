import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import type { ThemeColors } from "../../theme/colors";

export function LoadingState({
  palette,
  label = "Loading...",
}: {
  palette: ThemeColors;
  label?: string;
}) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={palette.tint} />
      <Text style={[styles.label, { color: palette.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 11, padding: 24 },
  label: { fontSize: 13 },
});
