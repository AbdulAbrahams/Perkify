import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../../theme/colors";
import { CardCategoryTabs, LoyaltyTile, type CardCategoryFilter } from "../../components";
import { getCardCategory } from "../../config/brands";
import { styles } from "../../styles/appStyles";
import type { LoyaltyCard } from "../../types/models";

type Props = {
  palette: (typeof Colors)["light"];
  cards: LoyaltyCard[];
  summary: { pointsBalance: number; pointsToNextReward: number };
  hideBalances: boolean;
  onOpenCards: () => void;
  onOpenCard: (card: LoyaltyCard) => void;
  onHistory: () => void;
  onAddCard: () => void;
  onScanCard: () => void;
};

export function HomeScreen({
  palette, cards, summary, hideBalances,
  onOpenCards, onOpenCard, onHistory, onAddCard, onScanCard,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<CardCategoryFilter>("all");
  const filteredCards = cards.filter((card) => {
    if (selectedCategory === "all") return true;
    return getCardCategory(card) === selectedCategory;
  });
  const categories = selectedCategory === "all"
    ? [
      { id: "grocery" as const, title: "Grocery" },
      { id: "petrol" as const, title: "Petrol" },
      { id: "retail" as const, title: "Retail" },
      { id: "rewards" as const, title: "Rewards" },
    ]
    : [{ id: selectedCategory, title: selectedCategory[0].toUpperCase() + selectedCategory.slice(1) }];
  const cardGroups = categories
    .map(({ id, title }) => ({
      title,
      cards: filteredCards.filter((card) => getCardCategory(card) === id),
    }))
    .filter((group) => group.cards.length > 0);
  const unclassifiedCards = selectedCategory === "all"
    ? filteredCards.filter((card) => !getCardCategory(card))
    : [];
  if (unclassifiedCards.length > 0) {
    cardGroups.push({ title: "Other", cards: unclassifiedCards });
  }
  const pointsTotal = summary.pointsBalance + summary.pointsToNextReward;
  const pointsProgress = pointsTotal > 0
    ? Math.max(0, Math.min(100, (summary.pointsBalance / pointsTotal) * 100))
    : 0;

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.homeContent} showsVerticalScrollIndicator={false}>
      <Pressable style={styles.pointsCard} onPress={onHistory}>
        <View style={styles.pointsCardTop}>
          <View>
            <Text style={styles.pointsEyebrow}>YOUR REWARD BALANCE</Text>
            <Text style={styles.pointsValue}>
              {hideBalances ? "••••" : summary.pointsBalance.toLocaleString()}{" "}
              {!hideBalances && <Text style={styles.pointsUnit}>pts</Text>}
            </Text>
          </View>
          <View style={styles.pointsIcon}>
            <Ionicons name="sparkles" size={21} color="#3DDAC0" />
          </View>
        </View>
        <View style={styles.pointsProgress}>
          <View style={[styles.pointsProgressFill, { width: `${pointsProgress}%` }]} />
        </View>
        <View style={styles.pointsCardBottom}>
          <Text style={styles.pointsHint}>
            {hideBalances ? "Balance hidden" : `${summary.pointsToNextReward.toLocaleString()} points to your next reward`}
          </Text>
          <Ionicons name="arrow-forward" size={15} color="#D3F4ED" />
        </View>
      </Pressable>

      <View style={styles.sectionHeading}>
        <View>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>My Cards</Text>
          <Text style={[styles.bodyText, { color: palette.textSecondary }]}>Your rewards, organized by category.</Text>
        </View>
        <Pressable onPress={onOpenCards}><Text style={styles.seeAll}>See all</Text></Pressable>
      </View>

      <CardCategoryTabs palette={palette} selected={selectedCategory} onSelect={setSelectedCategory} />

      {filteredCards.length === 0 && (
        <Text style={[styles.emptyCategoryNotice, { color: palette.textSecondary }]}>
          {selectedCategory === "all" ? "No cards yet." : `No ${selectedCategory} cards yet.`}
        </Text>
      )}

      {cardGroups.map((group) => (
        <View key={group.title}>
          <View style={styles.cardGroupHeading}>
            <Text style={[styles.cardGroupTitle, { color: palette.text }]}>{group.title}</Text>
            <Text style={[styles.cardGroupCount, { color: palette.textSecondary }]}>{group.cards.length}</Text>
          </View>
          <View style={styles.cardGrid}>
            {group.cards.map((card) => (
              <LoyaltyTile key={card.id} card={card} palette={palette} onPress={() => onOpenCard(card)} />
            ))}
          </View>
        </View>
      ))}

      <View style={styles.cardGrid}>
        <Pressable style={[styles.addTile, { backgroundColor: palette.surface, borderColor: palette.border }]} onPress={onAddCard}>
          <View style={styles.addTileIcon}><Ionicons name="add" size={23} color="#FFFFFF" /></View>
          <Text style={[styles.addTileText, { color: palette.text }]}>Add new card</Text>
        </Pressable>
      </View>

      <View style={styles.sectionHeading}>
        <View><Text style={[styles.sectionTitle, { color: palette.text }]}>Quick access</Text></View>
        <Pressable onPress={onHistory}><Text style={styles.seeAll}>History</Text></Pressable>
      </View>

      <View style={styles.quickActions}>
        <QuickAction icon="time-outline" label="Transactions" palette={palette} onPress={onHistory} />
        <QuickAction icon="scan-outline" label="Scan a card" palette={palette} onPress={onScanCard} />
        <QuickAction icon="gift-outline" label="My rewards" palette={palette} onPress={onOpenCards} />
      </View>
      <View style={{ height: 22 }} />
    </ScrollView>
  );
}

function QuickAction({
  icon, label, palette, onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  palette: (typeof Colors)["light"];
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.quickAction, { backgroundColor: palette.surface }]} onPress={onPress}>
      <View style={styles.quickActionIcon}>
        <Ionicons name={icon} size={20} color={Colors.light.tint} />
      </View>
      <Text style={[styles.quickActionLabel, { color: palette.text }]}>{label}</Text>
    </Pressable>
  );
}