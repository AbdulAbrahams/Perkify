import { ScrollView, Text, View } from "react-native";
import { Colors } from "../../theme/colors";
import { BackButton, MenuRow } from "../components";
import { styles } from "../styles/appStyles";

type Props = {
  page: "faq" | "help";
  palette: (typeof Colors)["light"];
  onBack: () => void;
  onOpenFaq: () => void;
  onOpenCards: () => void;
  onOpenSettings: () => void;
};

const frequentlyAskedQuestions = [
  {
    question: "How do I add a loyalty card?",
    answer: "Open My Cards, choose Add Card, and enter the card details. You can also scan a supported barcode while adding a card.",
  },
  {
    question: "Which barcodes can I scan?",
    answer: "The scanner currently supports Code 128 and EAN-13 barcodes. If a barcode cannot be scanned, you can enter its number manually.",
  },
  {
    question: "Where can I see my activity?",
    answer: "Open My Notifications to view your reward and transaction history.",
  },
  {
    question: "Where can I manage app preferences?",
    answer: "Open Settings to manage notifications and security preferences.",
  },
];

export function HelpCenterScreen({
  page,
  palette,
  onBack,
  onOpenFaq,
  onOpenCards,
  onOpenSettings,
}: Props) {
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.pageContent}>
      <BackButton palette={palette} onPress={onBack} />
      <Text style={[styles.sectionTitle, styles.editorTitle, { color: palette.text }]}>
        {page === "faq" ? "Frequently Asked Questions" : "Help"}
      </Text>

      {page === "faq" ? (
        <View style={styles.faqList}>
          {frequentlyAskedQuestions.map(({ question, answer }) => (
            <View key={question} style={[styles.faqCard, { backgroundColor: palette.surface }]}>
              <Text style={[styles.faqQuestion, { color: palette.text }]}>{question}</Text>
              <Text style={[styles.bodyText, { color: palette.textSecondary }]}>{answer}</Text>
            </View>
          ))}
        </View>
      ) : (
        <>
          <Text style={[styles.bodyText, styles.helpIntro, { color: palette.textSecondary }]}>
            Find quick help with your loyalty cards and account preferences.
          </Text>
          <View style={[styles.profileMenu, { backgroundColor: palette.surface }]}>
            <MenuRow icon="help-circle-outline" label="Frequently asked questions" palette={palette} onPress={onOpenFaq} />
            <MenuRow icon="card-outline" label="Manage my cards" palette={palette} onPress={onOpenCards} />
            <MenuRow icon="settings-outline" label="Settings and preferences" palette={palette} onPress={onOpenSettings} />
          </View>
        </>
      )}
    </ScrollView>
  );
}
