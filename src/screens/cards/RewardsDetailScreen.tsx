import { ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../../theme/colors";
import { BackButton } from "../../components";
import { styles } from "../../styles/appStyles";
import type { BrandRewards } from "../../config/rewards";

type Props = {
  palette: (typeof Colors)["light"];
  rewards: BrandRewards;
  onBack: () => void;
};

const benefitIcons: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  fuel: "fuel",
  "cash-multiple": "cash-multiple",
  "storefront-outline": "storefront-outline",
};

export function RewardsDetailScreen({ palette, rewards, onBack }: Props) {
  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={localStyles.page}
      showsVerticalScrollIndicator={false}
    >
      <BackButton palette={palette} onPress={onBack} />
      <Text style={[styles.eyebrow, { color: palette.textSecondary, letterSpacing: 1 }]}>
        {rewards.brandName.toUpperCase()} BENEFITS
      </Text>
      <Text style={[localStyles.heading, { color: palette.text }]}>{rewards.title}</Text>

      <View style={[localStyles.hero, { backgroundColor: palette.brandPrimary }]}>
        <View style={localStyles.heroIcon}>
          <MaterialCommunityIcons name="gift-outline" size={25} color="#FFFFFF" />
        </View>
        <Text style={localStyles.heroTitle}>
          {rewards.headline || `Make more of your ${rewards.brandName} card`}
        </Text>
        <Text style={localStyles.heroSubtitle}>
          {rewards.tagline || "Explore the benefits available with this rewards programme."}
        </Text>
      </View>

      <View style={localStyles.sectionHeading}>
        <Text style={[localStyles.sectionTitle, { color: palette.text }]}>How you can benefit</Text>
        {rewards.benefits.length > 0 ? (
          <Text style={[localStyles.benefitCount, { color: palette.textSecondary }]}>
            {rewards.benefits.length} benefits
          </Text>
        ) : null}
      </View>

      {rewards.benefits.length ? (
        rewards.benefits.map((benefit, index) => (
          <View
            key={benefit.title}
            style={[localStyles.benefitCard, { backgroundColor: palette.surface }]}
          >
            <View style={[localStyles.benefitIcon, { backgroundColor: `${palette.brandPrimary}18` }]}>
              <MaterialCommunityIcons
                name={benefitIcons[benefit.icon] ?? "gift-outline"}
                size={23}
                color={palette.brandPrimary}
              />
            </View>
            <View style={localStyles.benefitCopy}>
              <Text style={[localStyles.benefitIndex, { color: palette.brandPrimary }]}>
                BENEFIT {String(index + 1).padStart(2, "0")}
              </Text>
              <Text style={[localStyles.benefitTitle, { color: palette.text }]}>{benefit.title}</Text>
              <Text style={[localStyles.benefitDescription, { color: palette.textSecondary }]}>
                {benefit.description}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <View style={[localStyles.emptyCard, { backgroundColor: palette.surface }]}>
          <View style={[localStyles.emptyIcon, { backgroundColor: `${palette.brandPrimary}18` }]}>
            <MaterialCommunityIcons name="gift-outline" size={25} color={palette.brandPrimary} />
          </View>
          <Text style={[localStyles.emptyTitle, { color: palette.text }]}>Details coming soon</Text>
          <Text style={[localStyles.emptyDescription, { color: palette.textSecondary }]}>
            We haven't added verified reward details for {rewards.brandName} yet.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  page: { paddingHorizontal: 20, paddingTop: 17, paddingBottom: 36 },
  heading: { fontSize: 28, lineHeight: 34, fontWeight: "800", marginTop: 5, marginBottom: 20 },
  hero: { borderRadius: 24, padding: 22, marginBottom: 28 },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF24",
    marginBottom: 20,
  },
  heroTitle: { color: "#FFFFFF", fontSize: 22, lineHeight: 28, fontWeight: "800" },
  heroSubtitle: { color: "#FFFFFFD9", fontSize: 14, lineHeight: 21, marginTop: 7 },
  sectionHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 13,
  },
  sectionTitle: { fontSize: 17, fontWeight: "800" },
  benefitCount: { fontSize: 12, fontWeight: "600" },
  benefitCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    padding: 17,
    borderRadius: 19,
    marginBottom: 12,
  },
  benefitIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  benefitCopy: { flex: 1 },
  benefitIndex: { fontSize: 9, fontWeight: "800", letterSpacing: 0.9 },
  benefitTitle: { fontSize: 15, lineHeight: 21, fontWeight: "700", marginTop: 4 },
  benefitDescription: { fontSize: 13, lineHeight: 19, marginTop: 5 },
  emptyCard: { alignItems: "center", padding: 24, borderRadius: 20 },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },
  emptyTitle: { fontSize: 16, fontWeight: "800", textAlign: "center" },
  emptyDescription: { fontSize: 13, lineHeight: 20, textAlign: "center", marginTop: 7 },
});
