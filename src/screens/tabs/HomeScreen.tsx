import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../../theme/colors";
import { LoyaltyTile } from "../../components";
import { getInitials } from "../../utils/formatters";
import { styles } from "../../styles/appStyles";
import type { LoyaltyCard, UserProfile } from "../../types/models";

type Props = {
  palette: (typeof Colors)["light"];
  cards: LoyaltyCard[];
  profile: UserProfile | null;
  summary: { pointsBalance: number; pointsToNextReward: number };
  hideBalances: boolean;
  onOpenCards: () => void;
  onOpenCard: (card: LoyaltyCard) => void;
  onHistory: () => void;
  onAddCard: () => void;
};

export function HomeScreen({
  palette, cards, profile, summary, hideBalances,
  onOpenCards, onOpenCard, onHistory, onAddCard,
}: Props) {
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.homeContent} showsVerticalScrollIndicator={false}>
      <View style={styles.homeHeader}>
        <View style={styles.userGreeting}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>{getInitials(profile?.fullName ?? "Perkify Member")}</Text>
          </View>
          <View>
            <Text style={[styles.eyebrow, { color: palette.textSecondary }]}>Good morning,</Text>
            <Text style={[styles.userName, { color: palette.text }]}>{profile?.fullName ?? "Perkify Member"}</Text>
          </View>
        </View>
        <Pressable style={[styles.headerIconButton, { backgroundColor: palette.surface }]} onPress={onHistory}>
          <Ionicons name="notifications-outline" size={21} color={palette.text} />
          <View style={styles.notificationDot} />
        </Pressable>
      </View>

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
        <View style={styles.pointsProgress}><View style={styles.pointsProgressFill} /></View>
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
          <Text style={[styles.bodyText, { color: palette.textSecondary }]}>All your rewards, ready to use.</Text>
        </View>
        <Pressable onPress={onOpenCards}><Text style={styles.seeAll}>See all</Text></Pressable>
      </View>

      <View style={styles.cardGrid}>
        {cards.slice(0, 4).map((card) => (
          <LoyaltyTile key={card.id} card={card} palette={palette} onPress={() => onOpenCard(card)} />
        ))}
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
        <QuickAction icon="scan-outline" label="Scan a card" palette={palette} onPress={onAddCard} />
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