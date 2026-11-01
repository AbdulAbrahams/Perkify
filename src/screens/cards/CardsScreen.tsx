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
  onAdd: () => void;
  onSelect: (card: LoyaltyCard) => void;
};

export function CardsScreen({ palette, cards, onAdd, onSelect }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<CardCategoryFilter>("all");
  const filteredCards = cards.filter((card) => {
    if (selectedCategory === "all") return true;
    return getCardCategory(card) === selectedCategory;
  });

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.pageContent}>
      <View style={styles.pageHeader}>
        <View>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>My Cards</Text>
          <Text style={[styles.bodyText, { color: palette.textSecondary }]}>
            {filteredCards.length} {selectedCategory === "all" ? "loyalty cards" : `${selectedCategory} cards`}
          </Text>
        </View>
        <Pressable style={styles.smallAddButton} onPress={onAdd}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      <CardCategoryTabs palette={palette} selected={selectedCategory} onSelect={setSelectedCategory} />

      <View style={styles.cardGrid}>
        {filteredCards.map((card) => (
          <LoyaltyTile key={card.id} card={card} palette={palette} onPress={() => onSelect(card)} />
        ))}
      </View>

      {filteredCards.length === 0 && (
        <EmptyState
          palette={palette}
          title={selectedCategory === "all" ? "No cards yet" : `No ${selectedCategory} cards yet`}
          body={selectedCategory === "all"
            ? "Add your first loyalty card to keep your rewards together."
            : `Add a ${selectedCategory} loyalty card to see it in this filter.`}
          onPress={onAdd}
        />
      )}

      <Pressable style={styles.addWideButton} onPress={onAdd}>
        <Ionicons name="add-circle-outline" size={21} color={Colors.light.tint} />
        <Text style={styles.addWideText}>Add a new card</Text>
      </Pressable>
    </ScrollView>
  );
}

function EmptyState({
  palette, title, body, onPress,
}: {
  palette: (typeof Colors)["light"];
  title: string;
  body: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIcon, { backgroundColor: palette.surface }]}>
        <Ionicons name="card-outline" size={28} color={Colors.light.tint} />
      </View>
      <Text style={[styles.sectionTitle, { color: palette.text, marginBottom: 6 }]}>{title}</Text>
      <Text style={[styles.bodyText, { color: palette.textSecondary, textAlign: "center", marginBottom: 18 }]}>{body}</Text>
      <Pressable onPress={onPress}><Text style={styles.seeAll}>Add a card</Text></Pressable>
    </View>
  );
}