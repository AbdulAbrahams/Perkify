import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRewards } from "../../providers/RewardsProvider";
import { useAppState } from "../../providers/AppStateProvider";
import { usePalette } from "../../hooks/usePalette";
import { CardsScreen } from "../../screens/cards/CardsScreen";
import { styles } from "../../styles/appStyles";
import type { LoyaltyCard } from "../../types/models";

export default function CardsRoute() {
  const { palette } = usePalette();
  const rewards = useRewards();
  const { setSelectedCard } = useAppState();

  const select = (card: LoyaltyCard) => {
    setSelectedCard(card);
    router.push("/card-detail");
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <CardsScreen
        palette={palette}
        cards={rewards.cards}
        onAdd={() => router.push("/add-card")}
        onSelect={select}
      />
    </SafeAreaView>
  );
}