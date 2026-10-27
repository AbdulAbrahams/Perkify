import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ThemeColors } from "../../theme/colors";

export function BackButton({ palette, onPress }: { palette: ThemeColors; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      style={[styles.button, { backgroundColor: palette.surface }]}
      onPress={onPress}
    >
      <Ionicons name="arrow-back" size={20} color={palette.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 18 },
});
