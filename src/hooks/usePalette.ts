import { useColorScheme } from "react-native";
import { Colors, type ColorScheme } from "../../theme/colors";

export function usePalette() {
  const system = useColorScheme();
  const scheme: ColorScheme = system === "dark" ? "dark" : "light";
  return { palette: Colors[scheme], scheme };
}