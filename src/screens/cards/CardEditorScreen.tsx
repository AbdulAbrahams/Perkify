import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ThemeColors } from "../../../theme/colors";
import { BackButton, Button, FormField, Barcode } from "../../components";
import { SELECTABLE_CARD_BRANDS, type BrandConfig } from "../../config/brands";
import { styles } from "../../styles/appStyles";
import type { LoyaltyCardCategory } from "../../types/models";

type Props = {
  palette: ThemeColors;
  name: string;
  brandId: string | null;
  category: LoyaltyCardCategory | null;
  number: string;
  color: string;
  isEditing: boolean;
  onBrandSelect: (brand: BrandConfig) => void;
  onNumber: (value: string) => void;
  onColor: (value: string) => void;
  onSave: () => void;
  onBack: () => void;
  onScan: () => void; // 👈 New prop
};

export function CardEditorScreen({
  palette, name, brandId, category, number, color, isEditing, onBrandSelect, onNumber, onColor, onSave, onBack, onScan,
}: Props) {
  const [isBrandPickerOpen, setIsBrandPickerOpen] = useState(false);
  const selectedBrand = SELECTABLE_CARD_BRANDS.find((brand) => brand.id === brandId);

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.pageContent} keyboardShouldPersistTaps="handled">
      <BackButton palette={palette} onPress={onBack} />
      <Text style={[styles.sectionTitle, styles.editorTitle, { color: palette.text }]}>
        {isEditing ? "Edit Card" : "Add New Card"}
      </Text>
      <Text style={[styles.bodyText, styles.editorIntro, { color: palette.textSecondary }]}>
        Keep your loyalty details safe and easy to find.
      </Text>

      <View style={[styles.cardPreview, { backgroundColor: color }]}>
        <Text style={styles.cardPreviewBrand}>{name || "YOUR CARD"}</Text>
        <Barcode value={number || "null"} width={2} height={70} color={color === "#FFFFFF" ? "#1A1A1A" : "#FFFFFF"} backgroundColor={color} />
        <Text style={[styles.cardPreviewNumber, { color: color === "#FFFFFF" ? "#1A1A1A" : "#FFFFFF" }]}>
          {number || "••••  ••••  ••••"}
        </Text>
      </View>

      <Text style={[styles.fieldLabel, { color: palette.text, marginTop: 8 }]}>Select a brand</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isBrandPickerOpen }}
        style={[styles.brandSelector, { backgroundColor: palette.surface, borderColor: palette.border }]}
        onPress={() => setIsBrandPickerOpen((open) => !open)}
      >
        <Text style={[styles.brandSelectorText, { color: selectedBrand ? palette.text : palette.textSecondary }]}>
          {selectedBrand?.name ?? "Choose a brand"}
        </Text>
        <MaterialCommunityIcons
          name={isBrandPickerOpen ? "chevron-up" : "chevron-down"}
          size={22}
          color={palette.textSecondary}
        />
      </Pressable>

      {isBrandPickerOpen && (
        <View style={[styles.brandPickerMenu, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          {SELECTABLE_CARD_BRANDS.map((brand) => {
            const isSelected = brand.id === brandId;
            return (
              <Pressable
                key={brand.id}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                style={[
                  styles.brandPickerOption,
                  { backgroundColor: isSelected ? palette.background : "transparent" },
                ]}
                onPress={() => {
                  onBrandSelect(brand);
                  setIsBrandPickerOpen(false);
                }}
              >
                <View style={[styles.brandColorDot, { backgroundColor: brand.colors.primary, borderColor: palette.border }]} />
                <Text style={[styles.brandPickerName, { color: palette.text }]}>{brand.name}</Text>
                <Text style={[styles.brandPickerCategory, { color: palette.textSecondary }]}>
                  {brand.category[0].toUpperCase() + brand.category.slice(1)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
      
      {/* Card Number with Scan Button */}
      <FormField 
        label="Card number" 
        value={number} 
        onChangeText={onNumber} 
        placeholder="Enter membership number" 
        keyboardType="number-pad" 
        palette={palette}
        rightAction={
          <Pressable onPress={onScan} hitSlop={10}>
            <MaterialCommunityIcons name="barcode-scan" size={22} color={palette.brandAccent} />
          </Pressable>
        }
      />

      <Text style={[styles.fieldLabel, { color: palette.text, marginTop: 8 }]}>Choose a card color</Text>
      <View style={styles.colorChoices}>
        {["#3A4F4A", "#19C90A", "#20A9B5", "#F47A12", "#E93145", "#111111", "#FFFFFF"].map((swatch) => (
          <Pressable
            key={swatch}
            onPress={() => onColor(swatch)}
            style={[styles.colorSwatch, { backgroundColor: swatch, borderColor: color === swatch ? palette.brandAccent : palette.border }]}
          />
        ))}
      </View>

      <Button title={isEditing ? "Save changes" : "Save card"} onPress={onSave} disabled={!brandId || !name.trim() || !category} palette={palette} />
    </ScrollView>
  );
}