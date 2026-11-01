import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../../theme/colors";
import { LoyaltyTile } from "../../components";
import { styles } from "../../styles/appStyles";
import type { LoyaltyCard } from "../../types/models";

type Props = {
  palette: (typeof Colors)["light"];
  cards: LoyaltyCard[];
  onAdd: () => void;
  onSelect: (card: LoyaltyCard) => void;
};

export function CardsScreen({ palette, cards, onAdd, onSelect }: Props) {
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.pageContent}>
      <View style={styles.pageHeader}>
        <View>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>All Cards</Text>
          <Text style={[styles.bodyText, { color: palette.textSecondary }]}>
            {cards.length} loyalty cards in your wallet
          </Text>
        </View>
        <Pressable style={styles.smallAddButton} onPress={onAdd}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={styles.filterPills}>
        <View style={styles.filterPillActive}><Text style={styles.filterPillActiveText}>All Cards</Text></View>
        <View style={[styles.filterPill, { backgroundColor: palette.surface }]}>
          <Text style={[styles.filterPillText, { color: palette.textSecondary }]}>Points</Text>
        </View>
      </View>

      <View style={styles.cardGrid}>
        {cards.map((card) => (
          <LoyaltyTile key={card.id} card={card} palette={palette} onPress={() => onSelect(card)} />
        ))}
      </View>

      {cards.length === 0 && (
        <EmptyState palette={palette} title="No cards yet" body="Add your first loyalty card to keep your rewards together." onPress={onAdd} />
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