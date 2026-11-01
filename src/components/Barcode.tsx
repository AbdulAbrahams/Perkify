import React from "react";
import { View, StyleSheet } from "react-native";
import ExpoBarcode from "react-native-barcode-expo";

type Props = {
  value: string;
  width?: number; // Width of a single bar
  height?: number;
  color?: string;
  backgroundColor?: string;
};

export function Barcode({
  value,
  width = 2, // Default bar width for good scanning
  height = 70,
  color = "#000000",
  backgroundColor = "#FFFFFF",
}: Props) {
  if (!value) return null;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ExpoBarcode
        value={value}
        format="CODE128"
        width={width}
        height={height}
        lineColor={color}
        background={backgroundColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
  },
});