export type ThemeColors = {
  text: string;
  textSecondary: string;
  background: string;
  surface: string;
  surfaceSlate: string;
  tint: string;
  tabIconDefault: string;
  tabIconSelected: string;
  border: string;
};

export const Colors: {
  light: ThemeColors;
  dark: ThemeColors;
  brandPrimary: string;
  brandAccent: string;
  danger: string;
} = {
  light: {
    text: "#1A1A1A",
    textSecondary: "#757575",
    background: "#FFFFFF",
    surface: "#F4F4F4",
    surfaceSlate: "#3A4F4A",
    tint: "#238C7B",
    tabIconDefault: "#757575",
    tabIconSelected: "#238C7B",
    border: "#E0E0E0",
  },
  dark: {
    text: "#FFFFFF",
    textSecondary: "#A0A0A0",
    background: "#0F0F0F",
    surface: "#1C1C1E",
    surfaceSlate: "#3A4F4A",
    tint: "#3DDAC0",
    tabIconDefault: "#A0A0A0",
    tabIconSelected: "#3DDAC0",
    border: "#2C2C2E",
  },
  brandPrimary: "#238C7B",
  brandAccent: "#3DDAC0",
  danger: "#D32F2F",
};

export type ColorScheme = keyof Pick<typeof Colors, "light" | "dark">;
