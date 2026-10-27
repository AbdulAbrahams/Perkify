import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../theme/colors";

export function ErrorBanner({ message }: { message: string }) {
  return (
    <View accessibilityRole="alert" style={styles.banner}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { backgroundColor: "#D32F2F14", borderRadius: 12, paddingHorizontal: 13, paddingVertical: 10, marginBottom: 12 },
  message: { color: Colors.danger, fontSize: 13, lineHeight: 18 },
});
