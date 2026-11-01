import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRewards } from "../providers/RewardsProvider";
import { useAppState } from "../providers/AppStateProvider";
import { usePalette } from "../hooks/usePalette";
import { CardDetailScreen } from "../screens/cards/CardDetailScreen";
import { styles } from "../styles/appStyles";

export default function CardDetailRoute() {
  const { palette } = usePalette();
  const rewards = useRewards();
  const { selectedCard, setSelectedCard } = useAppState();

  if (!selectedCard) return null;

  const remove = async () => {
    const ok = await rewards.removeCard(selectedCard.id);
    if (!ok) return;
    setSelectedCard(null);
    router.replace("/(tabs)/cards");
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <CardDetailScreen
        palette={palette}
        card={selectedCard}
        onBack={() => { setSelectedCard(null); router.back(); }}
        onEdit={() => router.push("/add-card")}
        onRemove={() => void remove()}
      />
    </SafeAreaView>
  );
}