import { Image, Text, View, useColorScheme } from "react-native";
import { Colors } from "../../theme/colors";
import { Button } from "../components";
import { styles } from "../styles/appStyles";

// Ensure these filenames match your assets exactly
const APP_ICON_LIGHT = require("../../assets/app-icon-light.png");
const APP_ICON_DARK = require("../../assets/app-icon-dark.png");

type Props = {
  palette: (typeof Colors)["light"];
  onLogin: () => void;
  onSignup: () => void;
};

export function WelcomeScreen({ palette, onLogin, onSignup }: Props) {
  const systemScheme = useColorScheme();
  const isDark = systemScheme === "dark";

  return (
    <View style={[styles.centerPage, { backgroundColor: palette.background }]}>
      <View style={styles.welcomeBrand}>
        <Image source={isDark ? APP_ICON_DARK : APP_ICON_LIGHT} style={styles.welcomeLogo} resizeMode="contain" />
        <Text style={[styles.welcomeTitle, { color: palette.text }]}>Welcome to{"\n"}Perkify</Text>
        <Text style={[styles.welcomeSubtitle, { color: palette.textSecondary }]}>All your rewards in one happy place.</Text>
      </View>
      
      <View style={styles.welcomeActions}>
        <Button title="Log in" onPress={onLogin} palette={palette}/>
        <View style={styles.buttonSpacer} />
        <Button title="Create an account" onPress={onSignup} variant="secondary" palette={palette} />
        
        <Text style={[styles.termsText, { color: palette.textSecondary }]}>
          By continuing, you agree to our{" "}
          {/* Added palette.brandAccent here for dark mode visibility */}
          <Text style={[styles.linkText, { color: palette.brandAccent }]}>Terms</Text> and{" "}
          <Text style={[styles.linkText, { color: palette.brandAccent }]}>Privacy Policy</Text>.
        </Text>
      </View>
    </View>
  );
}