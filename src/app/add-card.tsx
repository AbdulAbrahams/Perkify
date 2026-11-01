import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Modal, View, StyleSheet, Pressable, Text } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useRewards } from "../providers/RewardsProvider";
import { useAppState } from "../providers/AppStateProvider";
import { usePalette } from "../hooks/usePalette";
import { CardEditorScreen } from "../screens/cards/CardEditorScreen";
import { CustomerHeader } from "../components";
import { styles } from "../styles/appStyles";
import { getBrandForCard, getCardCategory, SELECTABLE_CARD_BRANDS, type BrandConfig } from "../config/brands";
import type { LoyaltyCardCategory } from "../types/models";

export default function AddCardRoute() {
  const { mode, scan } = useLocalSearchParams<{ mode?: string; scan?: string }>();
  const { palette } = usePalette();
  const rewards = useRewards();
  const { selectedCard, setSelectedCard } = useAppState();
  const cardToEdit = mode === "edit" ? selectedCard : null;
  const isEditing = Boolean(cardToEdit);
  const existingBrand = cardToEdit ? getBrandForCard(cardToEdit) : null;
  const initialBrand = SELECTABLE_CARD_BRANDS.find((brand) => brand.id === existingBrand?.id) ?? null;

  const [brandId, setBrandId] = useState<string | null>(initialBrand?.id ?? null);
  const [name, setName] = useState(initialBrand?.name ?? "");
  const [category, setCategory] = useState<LoyaltyCardCategory | null>(
    initialBrand?.category ?? (cardToEdit ? getCardCategory(cardToEdit) : null),
  );
  const [number, setNumber] = useState(cardToEdit?.number ?? "");
  const [color, setColor] = useState(cardToEdit?.color ?? initialBrand?.colors.background ?? "#3A4F4A");

  // Camera state
  const [isScanning, setIsScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const openScanner = useCallback(async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }
    setIsScanning(true);
  }, [permission?.granted, requestPermission]);

  const autoScanStarted = useRef(false);
  useEffect(() => {
    if (scan === "true" && !autoScanStarted.current) {
      autoScanStarted.current = true;
      void openScanner();
    }
  }, [openScanner, scan]);

  const save = async () => {
    const trimmed = name.trim();
    if (!brandId || !trimmed || !category) return;
    const payload = { name: trimmed, category, number: number.trim() || null, color };
    const saved = cardToEdit
      ? await rewards.updateCard(cardToEdit.id, payload)
      : await rewards.addCard(payload);
    if (!saved) return;
    setSelectedCard(null);
    router.replace("/(tabs)/cards");
  };

  const selectBrand = (brand: BrandConfig) => {
    setBrandId(brand.id);
    setName(brand.name);
    setCategory(brand.category);
    setColor(brand.colors.background);
  };

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setNumber(data);
    setIsScanning(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      {/* <CustomerHeader /> */}
      <CardEditorScreen
        palette={palette}
        name={name}
        brandId={brandId}
        category={category}
        number={number}
        color={color}
        isEditing={isEditing}
        onBrandSelect={selectBrand}
        onNumber={setNumber}
        onColor={setColor}
        onSave={() => void save()}
        onBack={() => router.back()}
        onScan={openScanner} // 👈 Pass the scan handler
      />

      {/* Camera Modal */}
      <Modal visible={isScanning} animationType="slide" presentationStyle="fullScreen">
        <View style={localStyles.cameraContainer}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            onBarcodeScanned={handleBarcodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["code128", "ean13"],
            }}
          />

          {/* Overlay */}
          <View style={localStyles.overlay}>
            <View style={localStyles.topBar}>
              <Pressable onPress={() => setIsScanning(false)} style={localStyles.closeButton}>
                <Ionicons name="close" size={28} color="#FFFFFF" />
              </Pressable>
            </View>

            <View style={localStyles.scanFrame} />

            <View style={localStyles.hintContainer}>
              <Ionicons name="barcode-outline" size={20} color="#3DDAC0" />
              <View>
                <Text style={localStyles.hintTitle}>Align barcode</Text>
                <Text style={localStyles.hintSubtitle}>Point your camera at the barcode</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  cameraContainer: { flex: 1, backgroundColor: "#000" },
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: "space-between",
    paddingVertical: 60,
    alignItems: "center",
  },
  topBar: {
    width: "100%",
    paddingHorizontal: 20,
    alignItems: "flex-end",
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  scanFrame: {
    width: 280,
    height: 180,
    borderWidth: 2,
    borderColor: "#3DDAC0",
    borderRadius: 16,
    backgroundColor: "transparent",
  },
  hintContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 20,
  },
  hintTitle: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  hintSubtitle: {
    color: "#A0A0A0",
    fontSize: 12,
  },
});