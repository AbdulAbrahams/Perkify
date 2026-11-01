import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRewards } from "../../providers/RewardsProvider";
import { useAppState } from "../../providers/AppStateProvider";
import { usePalette } from "../../hooks/usePalette";
import { CustomerHeader, LoadingState } from "../../components";
import { HomeScreen } from "../../screens/tabs/HomeScreen";
import { styles } from "../../styles/appStyles";
import type { LoyaltyCard } from "../../types/models";

export default function HomeRoute() {
  const { palette } = usePalette();
  const rewards = useRewards();
  const { setSelectedCard } = useAppState();
  const isOpeningCard = useRef(false);

  useFocusEffect(useCallback(() => {
    isOpeningCard.current = false;
  }, []));

  if (rewards.isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
        <CustomerHeader />
        <LoadingState palette={palette} label="Loading your rewards..." />
      </SafeAreaView>
    );
  }

  const openCard = (card: LoyaltyCard) => {
    if (isOpeningCard.current) return;
    isOpeningCard.current = true;
    setSelectedCard(card);
    router.push({ pathname: "/card-detail", params: { from: "home" } });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <CustomerHeader />
      <HomeScreen
        palette={palette}
        cards={rewards.cards}
        summary={rewards.summary}
        hideBalances={rewards.settings.hideBalances}
        onOpenCards={() => router.push("/(tabs)/cards")}
        onOpenCard={openCard}
        onHistory={() => router.push("/history")}
        onAddCard={() => {
          setSelectedCard(null);
          router.push({ pathname: "/add-card", params: { mode: "create" } });
        }}
        onScanCard={() => {
          setSelectedCard(null);
          router.push({ pathname: "/add-card", params: { mode: "create", scan: "true" } });
        }}
      />
    </SafeAreaView>
  );
}