import { Pressable, StyleSheet, Text, View } from "react-native";
import type { ThemeColors } from "../../theme/colors";
import type { LoyaltyCard } from "../types/models";

export function LoyaltyTile({
  card,
  palette,
  onPress,
}: {
  card: LoyaltyCard;
  palette: ThemeColors;
  onPress: () => void;
}) {
  const darkCard = card.color === "#111111" || card.color.toLowerCase() === "#3a4f4a";
  const textColor = darkCard ? "#FFFFFF" : "#17201D";
  return (
    <Pressable style={[styles.tile, { backgroundColor: palette.surface }]} onPress={onPress}>
      <View style={[styles.logo, { backgroundColor: card.color }]}>
        <Text numberOfLines={2} style={[styles.logoText, { color: textColor }]}>{card.name}</Text>
      </View>
      <Text style={[styles.points, { color: palette.textSecondary }]}>{card.points}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: { width: "48.3%", borderRadius: 16, padding: 11, minHeight: 102, justifyContent: "space-between" },
  logo: { height: 55, borderRadius: 12, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  logoText: { textAlign: "center", fontWeight: "800", fontSize: 13 },
  points: { fontSize: 10, marginTop: 8 },
});
