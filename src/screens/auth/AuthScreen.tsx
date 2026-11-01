import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../../theme/colors";
import { BackButton, Button, FormField } from "../../components";
import { USE_MOCK_API } from "../../lib/api";
import { styles } from "../../styles/appStyles";

// Require both images at the top level
const AUTH_ICON_LIGHT = require("../../../assets/app-icon-light.png");
const AUTH_ICON_DARK = require("../../../assets/app-icon-dark.png");

type Props = {
  mode: "login" | "signup";
  palette: (typeof Colors)["light"];
  email: string;
  password: string;
  fullName: string;
  error: string;
  isSubmitting: boolean;
  onSocialLogin: () => void;
  onForgotPassword: () => void;
  onEmail: (value: string) => void;
  onPassword: (value: string) => void;
  onFullName: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  onSwitch: () => void;
};

export function AuthScreen({
  mode, palette, email, password, fullName, error, isSubmitting,
  onSocialLogin, onForgotPassword, onEmail, onPassword, onFullName,
  onSubmit, onBack, onSwitch,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  
  // Theme detection
  const systemScheme = useColorScheme();
  const isDark = systemScheme === "dark";

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: palette.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.authPage} keyboardShouldPersistTaps="handled">
        <BackButton palette={palette} onPress={onBack} />
        
        <View style={styles.authHeading}>
          <Image 
            source={isDark ? AUTH_ICON_DARK : AUTH_ICON_LIGHT} 
            style={styles.authLogo} 
            resizeMode="contain"
          />
          <Text style={[styles.sectionTitle, { color: palette.text }]}>
            {mode === "signup" ? "Sign Up" : "Welcome back"}
          </Text>
          <Text style={[styles.bodyText, { color: palette.textSecondary }]}>
            {mode === "signup" ? "Create your account and start saving your cards." : "Log in to your Perkify account."}
          </Text>
        </View>

        {mode === "signup" && (
          <FormField label="Full name" value={fullName} onChangeText={onFullName} placeholder="Your name" palette={palette} />
        )}
        
        <FormField label="Email address" value={email} onChangeText={onEmail} placeholder="you@example.com" keyboardType="email-address" palette={palette} />
        
        <FormField
          label="Password"
          value={password}
          onChangeText={onPassword}
          placeholder="At least 8 characters"
          secureTextEntry={!showPassword}
          palette={palette}
          rightAction={
            <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={10}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={19} color={palette.textSecondary} />
            </Pressable>
          }
        />

        {mode === "login" && (
          <Pressable style={styles.forgotButton} onPress={onForgotPassword} disabled={isSubmitting}>
            {/* Changed from styles.linkText to palette.brandAccent for dark mode visibility */}
            <Text style={[styles.linkText, { color: palette.brandAccent }]}>Forgot password?</Text>
          </Pressable>
        )}

        {USE_MOCK_API && (
          <Text style={[styles.mockHint, { color: palette.textSecondary }]}>
            Mock mode: use any valid email and a password with at least 8 characters.
          </Text>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button title={mode === "signup" ? "Sign up" : "Log in"} onPress={onSubmit} loading={isSubmitting} palette={palette} />

        <View style={styles.dividerRow}>
          <View style={[styles.divider, { backgroundColor: palette.border }]} />
          <Text style={[styles.dividerText, { color: palette.textSecondary }]}>or continue with</Text>
          <View style={[styles.divider, { backgroundColor: palette.border }]} />
        </View>

        <Pressable
          style={[styles.googleButton, { borderColor: palette.border }, !USE_MOCK_API && styles.disabledButton]}
          onPress={onSocialLogin}
          disabled={!USE_MOCK_API || isSubmitting}
        >
          <Text style={styles.googleG}>G</Text>
          <Text style={[styles.googleButtonText, { color: palette.text }]}>
            {USE_MOCK_API ? "Continue with Google (mock)" : "Google sign-in setup required"}
          </Text>
        </Pressable>

        <Text style={[styles.authSwitchText, { color: palette.textSecondary }]}>
          {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
          {/* Changed from styles.linkText to palette.brandAccent for dark mode visibility */}
          <Text onPress={onSwitch} style={[styles.linkText, { color: palette.brandAccent }]}>
            {mode === "signup" ? "Log in" : "Sign up"}
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}