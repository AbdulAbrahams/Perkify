import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import type { AuthSession } from "../types/models";

const SESSION_KEY = "perkify.biometric-session";
const ENABLED_KEY = "perkify.biometric-login-enabled";

export async function canUseBiometrics(): Promise<boolean> {
  if (Platform.OS === "web" || !(await SecureStore.isAvailableAsync())) return false;
  const [hasHardware, isEnrolled] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
  ]);
  return hasHardware && isEnrolled;
}

export async function isBiometricLoginConfigured(): Promise<boolean> {
  return (await AsyncStorage.getItem(ENABLED_KEY)) === "true";
}

export async function saveBiometricSession(session: AuthSession): Promise<void> {
  if (!(await canUseBiometrics())) {
    throw new Error("Set up Face ID or fingerprint unlock on this device before enabling biometric login.");
  }

  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session), {
    requireAuthentication: true,
    authenticationPrompt: "Confirm to enable biometric login",
  });
  await AsyncStorage.setItem(ENABLED_KEY, "true");
}

export async function readBiometricSession(): Promise<AuthSession | null> {
  const value = await SecureStore.getItemAsync(SESSION_KEY, {
    requireAuthentication: true,
    authenticationPrompt: "Unlock Perkify",
  });
  if (!value) return null;

  const session: unknown = JSON.parse(value);
  if (!isAuthSession(session)) {
    throw new Error("The saved biometric session is invalid. Sign in with your password again.");
  }
  return session;
}

export async function clearBiometricSession(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY);
  await AsyncStorage.removeItem(ENABLED_KEY);
}

function isAuthSession(value: unknown): value is AuthSession {
  if (typeof value !== "object" || value === null || !("accessToken" in value) || !("user" in value)) {
    return false;
  }
  const user = value.user;
  return (
    typeof value.accessToken === "string" &&
    typeof user === "object" &&
    user !== null &&
    "id" in user &&
    typeof user.id === "string" &&
    "fullName" in user &&
    typeof user.fullName === "string" &&
    "email" in user &&
    typeof user.email === "string" &&
    "avatarUrl" in user &&
    (typeof user.avatarUrl === "string" || user.avatarUrl === null) &&
    "createdAt" in user &&
    typeof user.createdAt === "string"
  );
}
