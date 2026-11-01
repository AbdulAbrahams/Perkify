import { ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../../theme/colors";
import { BackButton } from "../../components";
import { formatPoints, formatTransactionDate, getTransactionTone } from "../../utils/formatters";
import { styles } from "../../styles/appStyles";
import type { LoyaltyTransaction } from "../../types/models";

type Props = {
  palette: (typeof Colors)["light"];
  transactions: LoyaltyTransaction[];
  pointsBalance: number;
  hideBalances: boolean;
  onBack: () => void;
};

export function HistoryScreen({ palette, transactions, pointsBalance, hideBalances, onBack }: Props) {
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.pageContent}>
      <BackButton palette={palette} onPress={onBack} />
      <Text style={[styles.sectionTitle, styles.editorTitle, { color: palette.text }]}>Transaction History</Text>
      <Text style={[styles.bodyText, { color: palette.textSecondary, marginBottom: 20 }]}>
        A little progress, every time you shop.
      </Text>

      <View style={[styles.historyBalance, { backgroundColor: palette.surface }]}>
        <Text style={[styles.eyebrow, { color: palette.textSecondary }]}>TOTAL POINTS BALANCE</Text>
        <Text style={styles.historyBalanceValue}>
          {hideBalances ? "••••" : `${pointsBalance.toLocaleString()} pts`}
        </Text>
      </View>

      <Text style={[styles.fieldLabel, { color: palette.text, marginTop: 24, marginBottom: 12 }]}>Recent activity</Text>

      {transactions.map((item) => (
        <View key={item.id} style={[styles.activityRow, { borderBottomColor: palette.border }]}>
          <View style={[styles.activityIcon, { backgroundColor: getTransactionTone(item) === "positive" ? Colors.light.tint : palette.surfaceSlate }]}>
            <Ionicons name={item.pointsDelta >= 0 ? "add-circle" : "remove-circle"} size={20} color="#FFFFFF" />
          </View>
          <View style={styles.activityCopy}>
            <Text style={[styles.activityStore, { color: palette.text }]}>{item.merchant}</Text>
            <Text style={[styles.eyebrow, { color: palette.textSecondary }]}>
              {item.description} · {formatTransactionDate(item.occurredAt)}
            </Text>
          </View>
          <Text style={[styles.activityAmount, { color: getTransactionTone(item) === "positive" ? Colors.light.tint : palette.textSecondary }]}>
            {formatPoints(item.pointsDelta)}
          </Text>
        </View>
      ))}

      {transactions.length === 0 && (
        <Text style={[styles.bodyText, { color: palette.textSecondary }]}>Your activity will appear here.</Text>
      )}
    </ScrollView>
  );
}