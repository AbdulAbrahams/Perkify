import { router, useLocalSearchParams } from "expo-router";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRewards } from "../providers/RewardsProvider";
import { useAppState } from "../providers/AppStateProvider";
import { usePalette } from "../hooks/usePalette";
import { CardDetailScreen } from "../screens/cards/CardDetailScreen";
import { styles } from "../styles/appStyles";

export default function CardDetailRoute() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const { palette } = usePalette();
  const rewards = useRewards();
  const { selectedCard } = useAppState();

  if (!selectedCard) return null;

  const remove = async () => {
    const ok = await rewards.removeCard(selectedCard.id);
    if (!ok) {
      Alert.alert("Unable to remove card", "Please try again.");
      return false;
    }
    router.replace("/(tabs)/cards");
    return true;
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <CardDetailScreen
        palette={palette}
        card={selectedCard}
        onBack={() => router.dismissTo(from === "cards" ? "/(tabs)/cards" : "/(tabs)")}
        onViewRewards={() => router.push("/rewards-detail")}
        onEdit={() => router.push({ pathname: "/add-card", params: { mode: "edit" } })}
        onRemove={remove}
      />
    </SafeAreaView>
  );
}