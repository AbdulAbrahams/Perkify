import { Pressable, ScrollView, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, type ThemeColors } from "../../../theme/colors";
import { BackButton, Button, FormField, Barcode } from "../../components";
import { styles } from "../../styles/appStyles";

type Props = {
  palette: ThemeColors;
  name: string;
  number: string;
  color: string;
  isEditing: boolean;
  onName: (value: string) => void;
  onNumber: (value: string) => void;
  onColor: (value: string) => void;
  onSave: () => void;
  onBack: () => void;
  onScan: () => void; // 👈 New prop
};

export function CardEditorScreen({
  palette, name, number, color, isEditing, onName, onNumber, onColor, onSave, onBack, onScan,
}: Props) {
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

      <FormField label="Card name" value={name} onChangeText={onName} placeholder="e.g. Grocery rewards" palette={palette} />
      
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

      <Button title={isEditing ? "Save changes" : "Save card"} onPress={onSave} disabled={!name.trim()} palette={palette} />
    </ScrollView>
  );
}