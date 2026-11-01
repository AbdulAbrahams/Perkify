import { Pressable, ScrollView, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../../theme/colors";
import { BackButton, Button, Barcode } from "../../components";
import { styles } from "../../styles/appStyles";
import type { LoyaltyCard } from "../../types/models";

type Props = {
  palette: (typeof Colors)["light"];
  card: LoyaltyCard;
  onBack: () => void;
  onEdit: () => void;
  onRemove: () => void;
};

export function CardDetailScreen({ palette, card, onBack, onEdit, onRemove }: Props) {
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.pageContent}>
      <BackButton palette={palette} onPress={onBack} />
      <Text style={[styles.sectionTitle, styles.editorTitle, { color: palette.text }]}>Card Details</Text>

      <View style={[styles.detailCard, { backgroundColor: card.color }]}>
        <Text style={styles.cardPreviewBrand}>{card.name}</Text>
        <Barcode value={card.number || ""} width={2} height={120} color={card.color === "#FFFFFF" ? "#1A1A1A" : "#FFFFFF"} backgroundColor={card.color} />
        <Text style={[styles.cardPreviewNumber, { color: card.color === "#FFFFFF" ? "#1A1A1A" : "#FFFFFF" }]}>
          {card.number || "Scan your card in store"}
        </Text>
      </View>

      <View style={[styles.pointsSummary, { backgroundColor: palette.surface }]}>
        <Text style={[styles.eyebrow, { color: palette.textSecondary }]}>AVAILABLE REWARDS</Text>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>{card.points ?? "Member card"}</Text>
      </View>

      <Button title="Edit card" onPress={onEdit} palette={palette} />
      <Pressable style={[styles.dangerButton, { borderColor: Colors.danger }]} onPress={onRemove}>
        <Text style={styles.dangerButtonText}>Remove card</Text>
      </Pressable>
    </ScrollView>
  );
}