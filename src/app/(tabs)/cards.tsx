import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRewards } from "../../providers/RewardsProvider";
import { useAppState } from "../../providers/AppStateProvider";
import { usePalette } from "../../hooks/usePalette";
import { CustomerHeader } from "../../components";
import { CardsScreen } from "../../screens/cards/CardsScreen";
import { styles } from "../../styles/appStyles";
import type { LoyaltyCard } from "../../types/models";

export default function CardsRoute() {
  const { palette } = usePalette();
  const rewards = useRewards();
  const { setSelectedCard } = useAppState();
  const isOpeningCard = useRef(false);

  useFocusEffect(useCallback(() => {
    setSelectedCard(null);
    isOpeningCard.current = false;
  }, [setSelectedCard]));

  const select = (card: LoyaltyCard) => {
    if (isOpeningCard.current) return;
    isOpeningCard.current = true;
    setSelectedCard(card);
    router.push({ pathname: "/card-detail", params: { from: "cards" } });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <CustomerHeader />
      <CardsScreen
        palette={palette}
        cards={rewards.cards}
        onAdd={() => {
          setSelectedCard(null);
          router.push({ pathname: "/add-card", params: { mode: "create" } });
        }}
        onSelect={select}
      />
    </SafeAreaView>
  );
}