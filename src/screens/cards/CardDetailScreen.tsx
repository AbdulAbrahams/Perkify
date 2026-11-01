import { useRef, useState } from "react";
import {
  Animated,
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../../theme/colors";
import { BackButton, Button, Barcode } from "../../components";
import { styles } from "../../styles/appStyles";
import type { LoyaltyCard } from "../../types/models";

type Props = {
  palette: (typeof Colors)["light"];
  card: LoyaltyCard;
  onBack: () => void;
  onViewRewards: () => void;
  onEdit: () => void;
  onRemove: () => Promise<boolean>;
};

export function CardDetailScreen({ palette, card, onBack, onViewRewards, onEdit, onRemove }: Props) {
  const [confirmingRemoval, setConfirmingRemoval] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [cardFocused, setCardFocused] = useState(false);
  const focusScale = useRef(new Animated.Value(0.88)).current;
  const focusOpacity = useRef(new Animated.Value(0)).current;

  const confirmRemoval = async () => {
    setIsRemoving(true);
    try {
      if (await onRemove()) setConfirmingRemoval(false);
    } finally {
      setIsRemoving(false);
    }
  };

  const foreground = card.color.toLowerCase() === "#ffffff" ? "#17211F" : "#FFFFFF";
  const openCardFocus = () => setCardFocused(true);
  const closeCardFocus = () => {
    Animated.parallel([
      Animated.timing(focusOpacity, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(focusScale, { toValue: 0.92, duration: 120, useNativeDriver: true }),
    ]).start(() => setCardFocused(false));
  };

  return (
    <>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={localStyles.page}
        showsVerticalScrollIndicator={false}
      >
        <BackButton palette={palette} onPress={onBack} />
        <Text style={[styles.eyebrow, { color: palette.textSecondary }]}>YOUR WALLET</Text>
        <Text style={[localStyles.heading, { color: palette.text }]}>Card details</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Expand ${card.name} card`}
          accessibilityHint="Opens a focused view of the card"
          onPress={openCardFocus}
        >
        <View style={[localStyles.card, { backgroundColor: card.color }]}>
          <View style={localStyles.cardTop}>
            <View style={localStyles.cardBrand}>
              <Text style={[localStyles.cardEyebrow, { color: foreground, opacity: 0.78 }]}>LOYALTY CARD</Text>
              <Text style={[localStyles.brandName, { color: foreground }]} numberOfLines={1}>
                {card.name}
              </Text>
            </View>
            <View style={localStyles.cardMark}>
              <MaterialCommunityIcons name="cards-outline" size={23} color={foreground} />
            </View>
          </View>

          <View style={localStyles.barcodePanel}>
            {card.number ? (
              <Barcode value={card.number} width={2} height={72} color="#101715" backgroundColor="#FFFFFF" />
            ) : (
              <View style={localStyles.noBarcode}>
                <MaterialCommunityIcons name="barcode-scan" size={30} color="#65716D" />
                <Text style={localStyles.noBarcodeText}>No barcode added</Text>
              </View>
            )}
          </View>
          <Text style={[localStyles.cardNumber, { color: foreground }]} numberOfLines={1}>
            {card.number || "Add a barcode to scan in store"}
          </Text>
        </View>
        </Pressable>

        <View style={[localStyles.balanceCard, { backgroundColor: palette.surface }]}>
          <View style={[localStyles.balanceIcon, { backgroundColor: `${palette.brandPrimary}18` }]}>
            <Ionicons name="gift-outline" size={21} color={palette.brandPrimary} />
          </View>
          <View style={localStyles.balanceCopy}>
            <Text style={[localStyles.balanceLabel, { color: palette.textSecondary }]}>AVAILABLE REWARDS</Text>
            <Text style={[localStyles.balanceValue, { color: palette.text }]}>{card.points || "Member card"}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={palette.textSecondary} />
        </View>

        <View style={localStyles.actions}>
          <Button title="View rewards" onPress={onViewRewards} palette={palette} />
          <Button title="Edit card" onPress={onEdit} variant="outline" palette={palette} />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${card.name} card`}
          style={({ pressed }) => [localStyles.removeAction, pressed && { opacity: 0.65 }]}
          onPress={() => setConfirmingRemoval(true)}
        >
          <Ionicons name="trash-outline" size={18} color={Colors.danger} />
          <Text style={localStyles.removeText}>Remove card</Text>
        </Pressable>
      </ScrollView>

      <Modal
        visible={cardFocused}
        animationType="none"
        statusBarTranslucent
        onShow={() => {
          focusScale.setValue(0.88);
          focusOpacity.setValue(0);
          Animated.parallel([
            Animated.spring(focusScale, {
              toValue: 1,
              damping: 17,
              stiffness: 160,
              mass: 0.8,
              useNativeDriver: true,
            }),
            Animated.timing(focusOpacity, {
              toValue: 1,
              duration: 180,
              useNativeDriver: true,
            }),
          ]).start();
        }}
        onRequestClose={closeCardFocus}
      >
        <View style={[localStyles.focusRoot, { backgroundColor: palette.background }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close focused card view"
            style={[localStyles.focusClose, { backgroundColor: palette.surface }]}
            onPress={closeCardFocus}
          >
            <Ionicons name="close" size={24} color={palette.text} />
          </Pressable>
          <Animated.View
            accessibilityLabel={`${card.name} loyalty card`}
            style={{
              width: "100%",
              opacity: focusOpacity,
              transform: [{ scale: focusScale }],
            }}
          >
            <View style={[localStyles.card, localStyles.focusCard, { backgroundColor: card.color }]}>
              <View style={localStyles.cardTop}>
                <View style={localStyles.cardBrand}>
                  <Text style={[localStyles.cardEyebrow, { color: foreground, opacity: 0.78 }]}>
                    LOYALTY CARD
                  </Text>
                  <Text style={[localStyles.brandName, { color: foreground }]} numberOfLines={1}>
                    {card.name}
                  </Text>
                </View>
                <View style={localStyles.cardMark}>
                  <MaterialCommunityIcons name="cards-outline" size={23} color={foreground} />
                </View>
              </View>
              <View style={localStyles.barcodePanel}>
                {card.number ? (
                  <Barcode value={card.number} width={2} height={96} color="#101715" backgroundColor="#FFFFFF" />
                ) : (
                  <View style={localStyles.noBarcode}>
                    <MaterialCommunityIcons name="barcode-scan" size={34} color="#65716D" />
                    <Text style={localStyles.noBarcodeText}>No barcode added</Text>
                  </View>
                )}
              </View>
              <Text style={[localStyles.cardNumber, { color: foreground }]} numberOfLines={1}>
                {card.number || "Add a barcode to scan in store"}
              </Text>
            </View>
          </Animated.View>
        </View>
      </Modal>

      <Modal
        visible={confirmingRemoval}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => {
          if (!isRemoving) setConfirmingRemoval(false);
        }}
      >
        <View style={localStyles.modalRoot}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel card removal"
            style={StyleSheet.absoluteFill}
            onPress={() => {
              if (!isRemoving) setConfirmingRemoval(false);
            }}
          />
          <View
            accessibilityViewIsModal
            style={[localStyles.dialog, { backgroundColor: palette.background }]}
          >
            <View style={localStyles.dialogIcon}>
              <Ionicons name="trash-outline" size={24} color={Colors.danger} />
            </View>
            <Text style={[localStyles.dialogTitle, { color: palette.text }]}>Remove this card?</Text>
            <Text style={[localStyles.dialogDescription, { color: palette.textSecondary }]}>
              {card.name} will be removed from your wallet. This action cannot be undone.
            </Text>

            <View style={localStyles.dialogActions}>
              <Pressable
                accessibilityRole="button"
                disabled={isRemoving}
                style={[localStyles.cancelButton, { borderColor: palette.border }]}
                onPress={() => setConfirmingRemoval(false)}
              >
                <Text style={[localStyles.cancelText, { color: palette.text }]}>Keep card</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={isRemoving}
                style={[localStyles.confirmButton, isRemoving && { opacity: 0.7 }]}
                onPress={() => void confirmRemoval()}
              >
                {isRemoving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={localStyles.confirmText}>Remove</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const localStyles = StyleSheet.create({
  page: { paddingHorizontal: 20, paddingTop: 17, paddingBottom: 34 },
  heading: { fontSize: 28, lineHeight: 34, fontWeight: "800", marginTop: 5, marginBottom: 18 },
  card: {
    minHeight: 265,
    borderRadius: 24,
    padding: 20,
    justifyContent: "space-between",
    marginBottom: 18,
    overflow: "hidden",
  },
  focusRoot: { flex: 1, justifyContent: "center", paddingHorizontal: 22 },
  focusCard: { minHeight: 310, width: "100%", marginBottom: 0 },
  focusClose: {
    position: "absolute",
    top: 54,
    right: 22,
    zIndex: 1,
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  cardBrand: { flex: 1, paddingRight: 12 },
  cardEyebrow: { fontSize: 10, fontWeight: "700", letterSpacing: 1.2 },
  brandName: { fontSize: 21, fontWeight: "800", marginTop: 5 },
  cardMark: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF24",
  },
  barcodePanel: {
    minHeight: 94,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 8,
    marginTop: 22,
  },
  noBarcode: { minHeight: 80, alignItems: "center", justifyContent: "center", gap: 5 },
  noBarcodeText: { color: "#65716D", fontSize: 12, fontWeight: "600" },
  cardNumber: { fontSize: 12, fontWeight: "600", letterSpacing: 0.5, marginTop: 12 },
  balanceCard: {
    minHeight: 78,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  balanceIcon: { width: 44, height: 44, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  balanceCopy: { flex: 1, marginLeft: 13 },
  balanceLabel: { fontSize: 10, fontWeight: "700", letterSpacing: 0.8 },
  balanceValue: { fontSize: 16, fontWeight: "700", marginTop: 4 },
  actions: { gap: 11 },
  removeAction: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
  },
  removeText: { color: Colors.danger, fontSize: 14, fontWeight: "700" },
  modalRoot: {
    flex: 1,
    backgroundColor: "#00000080",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  dialog: { width: "100%", maxWidth: 400, borderRadius: 24, padding: 22, alignItems: "center" },
  dialogIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D32F2F18",
    marginBottom: 14,
  },
  dialogTitle: { fontSize: 20, fontWeight: "800", textAlign: "center" },
  dialogDescription: { fontSize: 14, lineHeight: 21, textAlign: "center", marginTop: 8 },
  dialogActions: { flexDirection: "row", gap: 10, width: "100%", marginTop: 22 },
  cancelButton: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: { fontSize: 14, fontWeight: "700" },
  confirmButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.danger,
  },
  confirmText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
});
