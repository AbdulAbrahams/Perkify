import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors, type ThemeColors } from "../../../theme/colors";
import { styles as appStyles } from "../../styles/appStyles";

type Props = {
  palette: ThemeColors;
};

export function ScanCardScreen({ palette }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: palette.background }} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.center, { backgroundColor: palette.background }]}>
        <Text style={[appStyles.sectionTitle, { color: palette.text, marginBottom: 12 }]}>
          Camera Access Needed
        </Text>
        <Text style={[appStyles.bodyText, { color: palette.textSecondary, textAlign: "center", marginBottom: 24, paddingHorizontal: 32 }]}>
          Perkify needs your camera to scan loyalty card barcodes.
        </Text>
        <Pressable 
          style={[styles.permissionButton, { backgroundColor: palette.brandPrimary }]} 
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    setScanned(true);
    
    // You can filter for specific types if needed:
    // if (type !== 'code128') return;

    Alert.alert(
      "Barcode Scanned",
      `Type: ${type}\nData: ${data}`,
      [
        { text: "Scan Again", onPress: () => setScanned(false) },
        { 
          text: "Use This Number", 
          onPress: () => {
            // Navigate back to add-card with the scanned data
            router.push({ pathname: "/add-card", params: { scannedNumber: data } });
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["code128", "ean13"], // Add formats you want to support
        }}
      />
      
      {/* Overlay UI */}
      <View style={styles.overlay}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </Pressable>
        </View>
        
        <View style={styles.scanFrame} />
        
        <Text style={styles.hintText}>
          Align the barcode within the frame
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  permissionButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  permissionButtonText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
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
  hintText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: "hidden",
  },
});