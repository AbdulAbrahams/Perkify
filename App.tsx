import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useState } from "react";
import { Colors, type ColorScheme } from "./theme/colors";
import {
  BackButton,
  BottomNav,
  Button,
  ErrorBanner,
  FormField,
  LoadingState,
  LoyaltyTile,
  MenuRow,
  SettingsToggle,
} from "./src/components";
import { useAuth } from "./src/providers/AuthProvider";
import { useProfile } from "./src/providers/ProfileProvider";
import { useRewards } from "./src/providers/RewardsProvider";
import { ApiProvider } from "./src/providers/ApiProvider";
import { AuthProvider } from "./src/providers/AuthProvider";
import { ProfileProvider } from "./src/providers/ProfileProvider";
import { RewardsProvider } from "./src/providers/RewardsProvider";
import { USE_MOCK_API } from "./src/lib/api";
import type { LoyaltyCard, LoyaltyTransaction, UserProfile } from "./src/types/models";
import type { AppScreen, MainTab } from "./src/types/navigation";
import {
  formatPoints,
  formatTransactionDate,
  getInitials,
  getTransactionTone,
} from "./src/utils/formatters";
import { validateEmail, validateFullName, validatePassword } from "./src/utils/validation";

const onboarding = [
  {
    title: "Discover All the Perks\nYou've Been Missing",
    body: "Find all your loyalty rewards in one simple place.",
    icon: "cards" as const,
  },
  {
    title: "Gain Points Faster",
    body: "Keep every loyalty card close and never miss a reward.",
    icon: "gift" as const,
  },
  {
    title: "Store All Your Loyalty\nCards in 1 Place!",
    body: "Your everyday rewards, always ready when you are.",
    icon: "wallet-giftcard" as const,
  },
];

export default function App() {
  return (
    <ApiProvider>
      <AuthProvider>
        <ProfileProvider>
          <RewardsProvider>
            <AppFlow />
          </RewardsProvider>
        </ProfileProvider>
      </AuthProvider>
    </ApiProvider>
  );
}

function AppFlow() {
  const systemScheme = useColorScheme();
  const colorScheme: ColorScheme = systemScheme === "dark" ? "dark" : "light";
  const palette = Colors[colorScheme];
  const [screen, setScreen] = useState<AppScreen>("onboarding");
  const [tab, setTab] = useState<MainTab>("home");
  const [onboardingIndex, setOnboardingIndex] = useState(0);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [selectedCard, setSelectedCard] = useState<LoyaltyCard | null>(null);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardColor, setCardColor] = useState("#3A4F4A");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [formError, setFormError] = useState("");
  const auth = useAuth();
  const profile = useProfile();
  const rewards = useRewards();

  const finishOnboarding = () => setScreen("welcome");
  const openAddCard = (card?: LoyaltyCard) => {
    setSelectedCard(card ?? null);
    setCardName(card?.name ?? "");
    setCardNumber(card?.number ?? "");
    setCardColor(card?.color ?? "#3A4F4A");
    setScreen("add-card");
  };
  const saveCard = async () => {
    const name = cardName.trim();
    if (!name) return;
    const saved = selectedCard
      ? await rewards.updateCard(selectedCard.id, { name, number: cardNumber.trim() || null, color: cardColor })
      : await rewards.addCard({ name, number: cardNumber.trim() || null, color: cardColor });
    if (!saved) return;
    if (selectedCard) {
      setSelectedCard({
        ...selectedCard,
        name,
        number: cardNumber.trim() || null,
        color: cardColor,
      });
    }
    setCardName("");
    setCardNumber("");
    setScreen("main");
    setTab("cards");
  };
  const submitAuth = async () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const nameError = authMode === "signup" ? validateFullName(fullName) : null;
    if (emailError || passwordError || nameError) {
      setFormError(emailError ?? passwordError ?? nameError ?? "Check the information and try again.");
      return;
    }
    setFormError("");
    const success = authMode === "signup"
      ? await auth.register({ email: email.trim(), password, fullName: fullName.trim() })
      : await auth.login({ email: email.trim(), password });
    if (success) {
      setScreen("main");
      setTab("home");
    }
  };
  const submitSocialAuth = async () => {
    if (!USE_MOCK_API) return;
    const success = await auth.login({ email: "john.doe@email.com", password: "mock-google-login" });
    if (success) {
      setScreen("main");
      setTab("home");
    }
  };
  const submitPasswordReset = async () => {
    const validationError = validateEmail(email);
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setFormError("");
    const requested = await auth.requestPasswordReset(email.trim());
    if (requested) {
      Alert.alert(
        "Password reset requested",
        "If an account matches that email, password reset instructions have been sent.",
      );
    }
  };
  const removeCard = async () => {
    if (!selectedCard) return;
    const removed = await rewards.removeCard(selectedCard.id);
    if (!removed) return;
    setSelectedCard(null);
    setScreen("main");
    setTab("cards");
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <StatusBar
        style={
          screen === "onboarding" || (screen === "main" && tab === "home" && colorScheme === "dark")
            ? "light"
            : colorScheme === "dark"
              ? "light"
              : "dark"
        }
      />
      {screen !== "onboarding" && screen !== "welcome" && screen !== "auth" && (rewards.error || profile.error || auth.error) ? (
        <View style={styles.errorContainer}>
          <ErrorBanner message={rewards.error ?? profile.error ?? auth.error ?? "Something went wrong."} />
        </View>
      ) : null}
      {screen === "onboarding" && (
        <OnboardingScreen
          index={onboardingIndex}
          palette={palette}
          onNext={() => {
            if (onboardingIndex === onboarding.length) finishOnboarding();
            else setOnboardingIndex((index) => index + 1);
          }}
          onSkip={finishOnboarding}
        />
      )}
      {screen === "welcome" && (
        <WelcomeScreen
          palette={palette}
          onLogin={() => {
            auth.clearError();
            setAuthMode("login");
            setScreen("auth");
          }}
          onSignup={() => {
            auth.clearError();
            setAuthMode("signup");
            setScreen("auth");
          }}
        />
      )}
      {screen === "auth" && (
        <AuthScreen
          mode={authMode}
          palette={palette}
          email={email}
          password={password}
          fullName={fullName}
          error={formError || auth.error || ""}
          isSubmitting={auth.isLoading}
          onSocialLogin={() => { void submitSocialAuth(); }}
          onForgotPassword={() => { void submitPasswordReset(); }}
          onEmail={setEmail}
          onPassword={setPassword}
          onFullName={setFullName}
          onSubmit={submitAuth}
          onBack={() => setScreen("welcome")}
          onSwitch={() => {
            setFormError("");
            auth.clearError();
            setAuthMode(authMode === "login" ? "signup" : "login");
          }}
        />
      )}
      {screen === "main" && (
        rewards.isLoading ? (
          <LoadingState palette={palette} label="Loading your rewards..." />
        ) : <View style={styles.flex}>
          {tab === "home" && (
            <HomeScreen
              palette={palette}
              cards={rewards.cards}
              profile={profile.profile ?? auth.user}
              summary={rewards.summary}
              hideBalances={rewards.settings.hideBalances}
              onOpenCards={() => setTab("cards")}
              onOpenCard={(card) => {
                setSelectedCard(card);
                setScreen("card-detail");
              }}
              onHistory={() => setScreen("history")}
              onAddCard={() => openAddCard()}
            />
          )}
          {tab === "cards" && (
            <CardsScreen
              palette={palette}
              cards={rewards.cards}
              onAdd={() => openAddCard()}
              onSelect={(card) => {
                setSelectedCard(card);
                setScreen("card-detail");
              }}
            />
          )}
          {tab === "profile" && (
            <ProfileScreen
              palette={palette}
              profile={profile.profile ?? auth.user}
              onEditProfile={() => {
                setFormError("");
                setScreen("profile-edit");
              }}
              onSettings={() => setScreen("settings")}
              onSecurity={() => setScreen("security")}
              onCards={() => setTab("cards")}
              onSignOut={() => {
                void auth.logout().then((success) => {
                  if (success) {
                    setScreen("welcome");
                    setTab("home");
                  }
                });
              }}
            />
          )}
          <BottomNav
            active={tab}
            palette={palette}
            onSelect={setTab}
          />
        </View>
      )}
      {screen === "add-card" && (
        <CardEditorScreen
          palette={palette}
          name={cardName}
          number={cardNumber}
          color={cardColor}
          isEditing={Boolean(selectedCard)}
          onName={setCardName}
          onNumber={setCardNumber}
          onColor={setCardColor}
          onSave={() => { void saveCard(); }}
          onBack={() => setScreen("main")}
        />
      )}
      {screen === "card-detail" && selectedCard && (
        <CardDetailScreen
          palette={palette}
          card={selectedCard}
          onBack={() => setScreen("main")}
          onEdit={() => openAddCard(selectedCard)}
          onRemove={removeCard}
        />
      )}
      {screen === "profile-edit" && (
        <ProfileEditScreen
          palette={palette}
          profile={profile.profile ?? auth.user}
          isSaving={profile.isLoading}
          error={formError}
          onBack={() => setScreen("main")}
          onSave={async (fullName, emailAddress) => {
            const nameError = validateFullName(fullName);
            const emailError = validateEmail(emailAddress);
            if (nameError || emailError) {
              setFormError(nameError ?? emailError ?? "Check your details and try again.");
              return;
            }
            setFormError("");
            const saved = await profile.updateProfile({
              fullName: fullName.trim(),
              email: emailAddress.trim(),
            });
            if (saved) {
              setScreen("main");
              setTab("profile");
            }
          }}
        />
      )}
      {screen === "history" && (
        rewards.isLoading ? <LoadingState palette={palette} label="Loading your activity..." /> : <HistoryScreen
          palette={palette}
          transactions={rewards.transactions}
          pointsBalance={rewards.summary.pointsBalance}
          hideBalances={rewards.settings.hideBalances}
          onBack={() => setScreen("main")}
        />
      )}
      {screen === "settings" && (
        <SettingsScreen
          palette={palette}
          settings={rewards.settings}
          onUpdateSettings={(changes) => { void rewards.updateSettings(changes); }}
          onBack={() => setScreen("main")}
          onSecurity={() => setScreen("security")}
        />
      )}
      {screen === "security" && (
        <SecurityScreen
          palette={palette}
          settings={rewards.settings}
          onUpdateSettings={(changes) => { void rewards.updateSettings(changes); }}
          onBack={() => setScreen("settings")}
        />
      )}
    </SafeAreaView>
  );
}

function OnboardingScreen({
  index,
  palette,
  onNext,
  onSkip,
}: {
  index: number;
  palette: (typeof Colors)["light"];
  onNext: () => void;
  onSkip: () => void;
}) {
  const slide = onboarding[index - 1];
  console.log(slide, 'slide')
  return (
    <View style={[styles.onboarding, { backgroundColor: "#0B0D0C" }]}>
      <View style={styles.onboardingTop}>
        <Image source={require("./applogo.png")} style={styles.onboardingLogo} resizeMode="contain" />
        <Text style={[styles.wordmark, { color: Colors.brandAccent }]}>Perkify</Text>
        <Pressable onPress={onSkip} hitSlop={12}>
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
      </View>
      <View style={styles.illustrationArea}>
        {index === 0 ? (
          <View style={styles.introLogoPanel}>
            <Image source={require("./applogo.png")} style={styles.introLogo} resizeMode="contain" />
            <Text style={styles.introWordmark}>Perkify</Text>
          </View>
        ) : (
          <RewardsIllustration index={index - 1} />
        )}
      </View>
      <Text style={styles.onboardingTitle}>{index === 0 ? "Your rewards,\nall in one place." : slide.title}</Text>
      <Text style={styles.onboardingBody}>{index === 0 ? "A smarter way to keep every loyalty card close." : slide.body}</Text>
      <View style={styles.onboardingFooter}>
        <View style={styles.dots}>
          {Array.from({ length: onboarding.length + 1 }, (_, dotIndex) => (
            <View
              key={dotIndex}
              style={[
                styles.dot,
                { backgroundColor: dotIndex === index ? Colors.brandAccent : "#49534F" },
              ]}
            />
          ))}
        </View>
        <Pressable style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>{index === onboarding.length ? "Get started" : "Continue"}</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
      <Text style={[styles.onboardingFootnote, { color: palette.textSecondary }]}>Your rewards. Your way.</Text>
    </View>
  );
}

function RewardsIllustration({ index }: { index: number }) {
  const names = index === 1 ? ["CHECKERS", "pick n pay", "W"] : ["bp", "SHELL", "WOOLWORTHS"];
  const colors = index === 1 ? ["#20A9B5", "#FFFFFF", "#111111"] : ["#19C90A", "#FFD522", "#111111"];
  return (
    <View style={styles.rewardStack}>
      <View style={[styles.rewardCard, styles.rewardBack, { backgroundColor: colors[0] }]}>
        <Text style={styles.rewardBrand}>{names[0]}</Text>
        <Ionicons name="sparkles" size={27} color="#FFFFFF" />
      </View>
      <View style={[styles.rewardCard, styles.rewardMiddle, { backgroundColor: colors[1] }]}>
        <Text style={[styles.rewardBrand, { color: "#1A1A1A" }]}>{names[1]}</Text>
        <View style={styles.rewardIcons}>
          <Text>😊</Text><Text>🎁</Text><Text>⭐</Text>
        </View>
      </View>
      <View style={[styles.rewardCard, styles.rewardFront, { backgroundColor: colors[2] }]}>
        <Text style={[styles.rewardBrand, { color: colors[2] === "#111111" ? "#FFFFFF" : "#1A1A1A" }]}>{names[2]}</Text>
        <Text style={styles.pointsText}>REWARDS MEMBER</Text>
      </View>
    </View>
  );
}

function WelcomeScreen({
  palette,
  onLogin,
  onSignup,
}: {
  palette: (typeof Colors)["light"];
  onLogin: () => void;
  onSignup: () => void;
}) {
  return (
    <View style={[styles.centerPage, { backgroundColor: palette.background }]}>
      <View style={styles.welcomeBrand}>
        <Image source={require("./assets/app-icon.png")} style={styles.welcomeLogo} />
        <Text style={[styles.welcomeTitle, { color: palette.text }]}>Welcome to{"\n"}Perkify</Text>
        <Text style={[styles.welcomeSubtitle, { color: palette.textSecondary }]}>All your rewards in one happy place.</Text>
      </View>
      <View style={styles.welcomeActions}>
        <Button title="Log in" onPress={onLogin} />
        <View style={styles.buttonSpacer} />
        <Button title="Create an account" onPress={onSignup} variant="secondary" palette={palette} />
        <Text style={[styles.termsText, { color: palette.textSecondary }]}>
          By continuing, you agree to our <Text style={styles.linkText}>Terms</Text> and <Text style={styles.linkText}>Privacy Policy</Text>.
        </Text>
      </View>
    </View>
  );
}

function AuthScreen({
  mode,
  palette,
  email,
  password,
  fullName,
  error,
  isSubmitting,
  onSocialLogin,
  onForgotPassword,
  onEmail,
  onPassword,
  onFullName,
  onSubmit,
  onBack,
  onSwitch,
}: {
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
}) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: palette.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.authPage} keyboardShouldPersistTaps="handled">
        <BackButton palette={palette} onPress={onBack} />
        <View style={styles.authHeading}>
          <Image source={require("./assets/app-icon.png")} style={styles.authLogo} />
          <Text style={[styles.sectionTitle, { color: palette.text }]}>{mode === "signup" ? "Sign Up" : "Welcome back"}</Text>
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
            <Text style={styles.linkText}>Forgot password?</Text>
          </Pressable>
        )}
        {USE_MOCK_API && (
          <Text style={[styles.mockHint, { color: palette.textSecondary }]}>
            Mock mode: use any valid email and a password with at least 8 characters.
          </Text>
        )}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button
          title={mode === "signup" ? "Sign up" : "Log in"}
          onPress={onSubmit}
          loading={isSubmitting}
        />
        <View style={styles.dividerRow}><View style={[styles.divider, { backgroundColor: palette.border }]} /><Text style={[styles.dividerText, { color: palette.textSecondary }]}>or continue with</Text><View style={[styles.divider, { backgroundColor: palette.border }]} /></View>
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
          <Text onPress={onSwitch} style={styles.linkText}>{mode === "signup" ? "Log in" : "Sign up"}</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function HomeScreen({
  palette,
  cards,
  profile,
  summary,
  hideBalances,
  onOpenCards,
  onOpenCard,
  onHistory,
  onAddCard,
}: {
  palette: (typeof Colors)["light"];
  cards: LoyaltyCard[];
  profile: UserProfile | null;
  summary: { pointsBalance: number; pointsToNextReward: number };
  hideBalances: boolean;
  onOpenCards: () => void;
  onOpenCard: (card: LoyaltyCard) => void;
  onHistory: () => void;
  onAddCard: () => void;
}) {
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.homeContent} showsVerticalScrollIndicator={false}>
      <View style={styles.homeHeader}>
        <View style={styles.userGreeting}>
          <View style={styles.avatar}><Text style={styles.avatarInitial}>{getInitials(profile?.fullName ?? "Perkify Member")}</Text></View>
          <View>
            <Text style={[styles.eyebrow, { color: palette.textSecondary }]}>Good morning,</Text>
            <Text style={[styles.userName, { color: palette.text }]}>{profile?.fullName ?? "Perkify Member"}</Text>
          </View>
        </View>
        <Pressable style={[styles.headerIconButton, { backgroundColor: palette.surface }]} onPress={onHistory}>
          <Ionicons name="notifications-outline" size={21} color={palette.text} />
          <View style={styles.notificationDot} />
        </Pressable>
      </View>
      <Pressable style={styles.pointsCard} onPress={onHistory}>
        <View style={styles.pointsCardTop}>
          <View><Text style={styles.pointsEyebrow}>YOUR REWARD BALANCE</Text><Text style={styles.pointsValue}>{hideBalances ? "••••" : summary.pointsBalance.toLocaleString()} {!hideBalances && <Text style={styles.pointsUnit}>pts</Text>}</Text></View>
          <View style={styles.pointsIcon}><Ionicons name="sparkles" size={21} color="#3DDAC0" /></View>
        </View>
        <View style={styles.pointsProgress}><View style={styles.pointsProgressFill} /></View>
        <View style={styles.pointsCardBottom}><Text style={styles.pointsHint}>{hideBalances ? "Balance hidden" : `${summary.pointsToNextReward.toLocaleString()} points to your next reward`}</Text><Ionicons name="arrow-forward" size={15} color="#D3F4ED" /></View>
      </Pressable>
      <View style={styles.sectionHeading}>
        <View><Text style={[styles.sectionTitle, { color: palette.text }]}>My Cards</Text><Text style={[styles.bodyText, { color: palette.textSecondary }]}>All your rewards, ready to use.</Text></View>
        <Pressable onPress={onOpenCards}><Text style={styles.seeAll}>See all</Text></Pressable>
      </View>
      <View style={styles.cardGrid}>
        {cards.slice(0, 4).map((card) => <LoyaltyTile key={card.id} card={card} palette={palette} onPress={() => onOpenCard(card)} />)}
        <Pressable style={[styles.addTile, { backgroundColor: palette.surface, borderColor: palette.border }]} onPress={onAddCard}>
          <View style={styles.addTileIcon}><Ionicons name="add" size={23} color="#FFFFFF" /></View>
          <Text style={[styles.addTileText, { color: palette.text }]}>Add new card</Text>
        </Pressable>
      </View>
      <View style={styles.sectionHeading}>
        <View><Text style={[styles.sectionTitle, { color: palette.text }]}>Quick access</Text></View>
        <Pressable onPress={onHistory}><Text style={styles.seeAll}>History</Text></Pressable>
      </View>
      <View style={styles.quickActions}>
        <QuickAction icon="time-outline" label="Transactions" palette={palette} onPress={onHistory} />
        <QuickAction icon="scan-outline" label="Scan a card" palette={palette} onPress={onAddCard} />
        <QuickAction icon="gift-outline" label="My rewards" palette={palette} onPress={onOpenCards} />
      </View>
      <View style={{ height: 22 }} />
    </ScrollView>
  );
}

function CardsScreen({
  palette,
  cards,
  onAdd,
  onSelect,
}: {
  palette: (typeof Colors)["light"];
  cards: LoyaltyCard[];
  onAdd: () => void;
  onSelect: (card: LoyaltyCard) => void;
}) {
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.pageContent}>
      <View style={styles.pageHeader}>
        <View><Text style={[styles.sectionTitle, { color: palette.text }]}>All Cards</Text><Text style={[styles.bodyText, { color: palette.textSecondary }]}>{cards.length} loyalty cards in your wallet</Text></View>
        <Pressable style={styles.smallAddButton} onPress={onAdd}><Ionicons name="add" size={20} color="#FFFFFF" /></Pressable>
      </View>
      <View style={styles.filterPills}>
        <View style={styles.filterPillActive}><Text style={styles.filterPillActiveText}>All Cards</Text></View>
        <View style={[styles.filterPill, { backgroundColor: palette.surface }]}><Text style={[styles.filterPillText, { color: palette.textSecondary }]}>Points</Text></View>
      </View>
      <View style={styles.cardGrid}>
        {cards.map((card) => <LoyaltyTile key={card.id} card={card} palette={palette} onPress={() => onSelect(card)} />)}
      </View>
      {cards.length === 0 && <EmptyState palette={palette} title="No cards yet" body="Add your first loyalty card to keep your rewards together." onPress={onAdd} />}
      <Pressable style={styles.addWideButton} onPress={onAdd}><Ionicons name="add-circle-outline" size={21} color={Colors.light.tint} /><Text style={styles.addWideText}>Add a new card</Text></Pressable>
    </ScrollView>
  );
}

function CardEditorScreen({
  palette,
  name,
  number,
  color,
  isEditing,
  onName,
  onNumber,
  onColor,
  onSave,
  onBack,
}: {
  palette: (typeof Colors)["light"];
  name: string;
  number: string;
  color: string;
  isEditing: boolean;
  onName: (value: string) => void;
  onNumber: (value: string) => void;
  onColor: (value: string) => void;
  onSave: () => void;
  onBack: () => void;
}) {
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.pageContent} keyboardShouldPersistTaps="handled">
      <BackButton palette={palette} onPress={onBack} />
      <Text style={[styles.sectionTitle, styles.editorTitle, { color: palette.text }]}>{isEditing ? "Edit Card" : "Add New Card"}</Text>
      <Text style={[styles.bodyText, styles.editorIntro, { color: palette.textSecondary }]}>Keep your loyalty details safe and easy to find.</Text>
      <View style={[styles.cardPreview, { backgroundColor: color }]}>
        <Text style={styles.cardPreviewBrand}>{name || "YOUR CARD"}</Text>
        <MaterialCommunityIcons name="barcode" size={92} color={color === "#FFFFFF" ? "#1A1A1A" : "#FFFFFF"} />
        <Text style={[styles.cardPreviewNumber, { color: color === "#FFFFFF" ? "#1A1A1A" : "#FFFFFF" }]}>{number || "••••  ••••  ••••"}</Text>
      </View>
      <FormField label="Card name" value={name} onChangeText={onName} placeholder="e.g. Grocery rewards" palette={palette} />
      <FormField label="Card number" value={number} onChangeText={onNumber} placeholder="Enter membership number" keyboardType="number-pad" palette={palette} />
      <Text style={[styles.fieldLabel, { color: palette.text, marginTop: 8 }]}>Choose a card color</Text>
      <View style={styles.colorChoices}>
        {["#3A4F4A", "#19C90A", "#20A9B5", "#F47A12", "#E93145", "#111111", "#FFFFFF"].map((swatch) => (
          <Pressable key={swatch} onPress={() => onColor(swatch)} style={[styles.colorSwatch, { backgroundColor: swatch, borderColor: color === swatch ? Colors.brandAccent : palette.border }]} />
        ))}
      </View>
      <Button title={isEditing ? "Save changes" : "Save card"} onPress={onSave} disabled={!name.trim()} />
    </ScrollView>
  );
}

function CardDetailScreen({
  palette,
  card,
  onBack,
  onEdit,
  onRemove,
}: {
  palette: (typeof Colors)["light"];
  card: LoyaltyCard;
  onBack: () => void;
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.pageContent}>
      <BackButton palette={palette} onPress={onBack} />
      <Text style={[styles.sectionTitle, styles.editorTitle, { color: palette.text }]}>Card Details</Text>
      <View style={[styles.detailCard, { backgroundColor: card.color }]}>
        <Text style={styles.cardPreviewBrand}>{card.name}</Text>
        <MaterialCommunityIcons name="barcode" size={120} color={card.color === "#FFFFFF" ? "#1A1A1A" : "#FFFFFF"} />
        <Text style={[styles.cardPreviewNumber, { color: card.color === "#FFFFFF" ? "#1A1A1A" : "#FFFFFF" }]}>{card.number || "Scan your card in store"}</Text>
      </View>
      <View style={[styles.pointsSummary, { backgroundColor: palette.surface }]}>
        <Text style={[styles.eyebrow, { color: palette.textSecondary }]}>AVAILABLE REWARDS</Text>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>{card.points ?? "Member card"}</Text>
      </View>
      <Button title="Edit card" onPress={onEdit} />
      <Pressable style={[styles.dangerButton, { borderColor: Colors.danger }]} onPress={onRemove}><Text style={styles.dangerButtonText}>Remove card</Text></Pressable>
    </ScrollView>
  );
}

function HistoryScreen({
  palette,
  transactions,
  pointsBalance,
  hideBalances,
  onBack,
}: {
  palette: (typeof Colors)["light"];
  transactions: LoyaltyTransaction[];
  pointsBalance: number;
  hideBalances: boolean;
  onBack: () => void;
}) {
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.pageContent}>
      <BackButton palette={palette} onPress={onBack} />
      <Text style={[styles.sectionTitle, styles.editorTitle, { color: palette.text }]}>Transaction History</Text>
      <Text style={[styles.bodyText, { color: palette.textSecondary, marginBottom: 20 }]}>A little progress, every time you shop.</Text>
      <View style={[styles.historyBalance, { backgroundColor: palette.surface }]}>
        <Text style={[styles.eyebrow, { color: palette.textSecondary }]}>TOTAL POINTS BALANCE</Text>
        <Text style={styles.historyBalanceValue}>{hideBalances ? "••••" : `${pointsBalance.toLocaleString()} pts`}</Text>
      </View>
      <Text style={[styles.fieldLabel, { color: palette.text, marginTop: 24, marginBottom: 12 }]}>Recent activity</Text>
      {transactions.map((item) => (
        <View key={item.id} style={[styles.activityRow, { borderBottomColor: palette.border }]}>
          <View style={[styles.activityIcon, { backgroundColor: getTransactionTone(item) === "positive" ? Colors.light.tint : palette.surfaceSlate }]}><Ionicons name={item.pointsDelta >= 0 ? "add-circle" : "remove-circle"} size={20} color="#FFFFFF" /></View>
          <View style={styles.activityCopy}><Text style={[styles.activityStore, { color: palette.text }]}>{item.merchant}</Text><Text style={[styles.eyebrow, { color: palette.textSecondary }]}>{item.description} · {formatTransactionDate(item.occurredAt)}</Text></View>
          <Text style={[styles.activityAmount, { color: getTransactionTone(item) === "positive" ? Colors.light.tint : palette.textSecondary }]}>{formatPoints(item.pointsDelta)}</Text>
        </View>
      ))}
      {transactions.length === 0 && <Text style={[styles.bodyText, { color: palette.textSecondary }]}>Your activity will appear here.</Text>}
    </ScrollView>
  );
}

function ProfileScreen({
  palette,
  profile,
  onEditProfile,
  onSettings,
  onSecurity,
  onCards,
  onSignOut,
}: {
  palette: (typeof Colors)["light"];
  profile: UserProfile | null;
  onEditProfile: () => void;
  onSettings: () => void;
  onSecurity: () => void;
  onCards: () => void;
  onSignOut: () => void;
}) {
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.pageContent}>
      <Text style={[styles.sectionTitle, { color: palette.text, marginBottom: 18 }]}>Profile</Text>
      <View style={styles.profileHeader}>
        <View style={[styles.profileAvatar, { backgroundColor: palette.surfaceSlate }]}><Text style={styles.profileAvatarText}>{getInitials(profile?.fullName ?? "")}</Text></View>
        <Text style={[styles.profileName, { color: palette.text }]}>{profile?.fullName ?? "Perkify Member"}</Text>
        <Text style={[styles.bodyText, { color: palette.textSecondary }]}>{profile?.email ?? ""}</Text>
      </View>
      <View style={[styles.profileMenu, { backgroundColor: palette.surface }]}>
        <Text style={[styles.eyebrow, styles.menuEyebrow, { color: palette.textSecondary }]}>YOUR ACCOUNT</Text>
        <MenuRow icon="person-outline" label="Personal information" palette={palette} onPress={onEditProfile} />
        <MenuRow icon="card-outline" label="My cards" palette={palette} onPress={onCards} />
        <MenuRow icon="settings-outline" label="Settings" palette={palette} onPress={onSettings} />
        <MenuRow icon="shield-checkmark-outline" label="Security & Privacy" palette={palette} onPress={onSecurity} />
      </View>
      <Pressable style={[styles.signOutButton, { borderColor: palette.border }]} onPress={onSignOut}>
        <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
        <Text style={styles.dangerButtonText}>Log out</Text>
      </Pressable>
    </ScrollView>
  );
}

function ProfileEditScreen({
  palette,
  profile,
  isSaving,
  error,
  onBack,
  onSave,
}: {
  palette: (typeof Colors)["light"];
  profile: UserProfile | null;
  isSaving: boolean;
  error: string;
  onBack: () => void;
  onSave: (fullName: string, email: string) => void;
}) {
  const [fullName, setFullName] = useState(profile?.fullName ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.pageContent}>
      <BackButton palette={palette} onPress={onBack} />
      <Text style={[styles.sectionTitle, styles.editorTitle, { color: palette.text }]}>Personal Information</Text>
      <Text style={[styles.bodyText, styles.editorIntro, { color: palette.textSecondary }]}>Update the details connected to your account.</Text>
      <FormField label="Full name" value={fullName} onChangeText={setFullName} placeholder="Your name" palette={palette} autoCapitalize="words" />
      <FormField label="Email address" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" palette={palette} />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button title="Save profile" onPress={() => onSave(fullName, email)} loading={isSaving} />
    </ScrollView>
  );
}

function SettingsScreen({
  palette,
  settings,
  onUpdateSettings,
  onBack,
  onSecurity,
}: {
  palette: (typeof Colors)["light"];
  settings: { notificationsEnabled: boolean; biometricLoginEnabled: boolean; hideBalances: boolean };
  onUpdateSettings: (changes: { notificationsEnabled?: boolean; biometricLoginEnabled?: boolean; hideBalances?: boolean }) => void;
  onBack: () => void;
  onSecurity: () => void;
}) {
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.pageContent}>
      <BackButton palette={palette} onPress={onBack} />
      <Text style={[styles.sectionTitle, styles.editorTitle, { color: palette.text }]}>Settings</Text>
      <Text style={[styles.eyebrow, styles.menuEyebrow, { color: palette.textSecondary }]}>PREFERENCES</Text>
      <View style={[styles.profileMenu, { backgroundColor: palette.surface }]}>
        <SettingsToggle icon="notifications-outline" label="Push notifications" value={settings.notificationsEnabled} onValueChange={(value) => onUpdateSettings({ notificationsEnabled: value })} palette={palette} />
        <MenuRow icon="shield-checkmark-outline" label="Security & Privacy" palette={palette} onPress={onSecurity} />
        <SettingsToggle icon="finger-print-outline" label="Biometric login" value={settings.biometricLoginEnabled} onValueChange={(value) => onUpdateSettings({ biometricLoginEnabled: value })} palette={palette} />
      </View>
      <Text style={[styles.eyebrow, styles.menuEyebrow, { color: palette.textSecondary, marginTop: 26 }]}>ABOUT</Text>
      <View style={[styles.profileMenu, { backgroundColor: palette.surface }]}>
        <MenuRow icon="document-text-outline" label="Terms of service" palette={palette} onPress={() => {}} />
        <MenuRow icon="lock-closed-outline" label="Privacy policy" palette={palette} onPress={() => {}} />
        <View style={styles.versionRow}><Text style={[styles.bodyText, { color: palette.textSecondary }]}>App version</Text><Text style={[styles.bodyText, { color: palette.textSecondary }]}>1.0.0</Text></View>
      </View>
    </ScrollView>
  );
}

function SecurityScreen({
  palette,
  settings,
  onUpdateSettings,
  onBack,
}: {
  palette: (typeof Colors)["light"];
  settings: { notificationsEnabled: boolean; biometricLoginEnabled: boolean; hideBalances: boolean };
  onUpdateSettings: (changes: { notificationsEnabled?: boolean; biometricLoginEnabled?: boolean; hideBalances?: boolean }) => void;
  onBack: () => void;
}) {
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.pageContent}>
      <BackButton palette={palette} onPress={onBack} />
      <Text style={[styles.sectionTitle, styles.editorTitle, { color: palette.text }]}>Security & Privacy</Text>
      <Text style={[styles.bodyText, { color: palette.textSecondary, marginBottom: 22 }]}>You're in control of your account and data.</Text>
      <View style={[styles.profileMenu, { backgroundColor: palette.surface }]}>
        <SettingsToggle icon="finger-print-outline" label="Biometric login" value={settings.biometricLoginEnabled} onValueChange={(value) => onUpdateSettings({ biometricLoginEnabled: value })} palette={palette} />
        <SettingsToggle icon="eye-off-outline" label="Hide balances" value={settings.hideBalances} onValueChange={(value) => onUpdateSettings({ hideBalances: value })} palette={palette} />
      </View>
      <View style={[styles.privacyNote, { backgroundColor: palette.surface }]}>
        <Ionicons name="shield-checkmark-outline" size={22} color={Colors.light.tint} />
        <Text style={[styles.bodyText, { color: palette.textSecondary, flex: 1 }]}>Your loyalty card details are stored securely on this device.</Text>
      </View>
      <Pressable style={[styles.signOutButton, { borderColor: palette.border }]}><Text style={styles.linkText}>Change password</Text></Pressable>
    </ScrollView>
  );
}

function QuickAction({
  icon,
  label,
  palette,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  palette: (typeof Colors)["light"];
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.quickAction, { backgroundColor: palette.surface }]} onPress={onPress}>
      <View style={styles.quickActionIcon}><Ionicons name={icon} size={20} color={Colors.light.tint} /></View>
      <Text style={[styles.quickActionLabel, { color: palette.text }]}>{label}</Text>
    </Pressable>
  );
}

function EmptyState({
  palette,
  title,
  body,
  onPress,
}: {
  palette: (typeof Colors)["light"];
  title: string;
  body: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIcon, { backgroundColor: palette.surface }]}><Ionicons name="card-outline" size={28} color={Colors.light.tint} /></View>
      <Text style={[styles.sectionTitle, { color: palette.text, marginBottom: 6 }]}>{title}</Text>
      <Text style={[styles.bodyText, { color: palette.textSecondary, textAlign: "center", marginBottom: 18 }]}>{body}</Text>
      <Pressable onPress={onPress}><Text style={styles.seeAll}>Add a card</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  errorContainer: { paddingHorizontal: 20, paddingTop: 12 },
  onboarding: { flex: 1, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 24 },
  onboardingTop: { height: 48, flexDirection: "row", alignItems: "center" },
  onboardingLogo: { width: 30, height: 34 },
  wordmark: { fontSize: 17, fontWeight: "700", marginLeft: 8 },
  skip: { color: "#A0A0A0", fontSize: 14, marginLeft: "auto" },
  illustrationArea: { flex: 1, minHeight: 245, alignItems: "center", justifyContent: "center" },
  introLogoPanel: { width: 174, height: 188, alignItems: "center", justifyContent: "center" },
  introLogo: { width: 132, height: 132 },
  introWordmark: { fontSize: 24, fontWeight: "700", color: Colors.brandAccent, marginTop: -6 },
  rewardStack: { width: 250, height: 235, alignItems: "center", justifyContent: "center" },
  rewardCard: { position: "absolute", width: 205, height: 128, borderRadius: 20, padding: 17, justifyContent: "space-between", shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 12, elevation: 7 },
  rewardBack: { transform: [{ rotate: "-13deg" }, { translateX: -8 }, { translateY: -23 }] },
  rewardMiddle: { transform: [{ rotate: "10deg" }, { translateX: 12 }, { translateY: -3 }] },
  rewardFront: { transform: [{ rotate: "-5deg" }, { translateY: 29 }] },
  rewardBrand: { fontSize: 20, fontWeight: "800", color: "#FFFFFF" },
  rewardIcons: { flexDirection: "row", justifyContent: "space-between" },
  pointsText: { fontSize: 9, fontWeight: "700", color: "#D4D4D4", letterSpacing: 1.4 },
  onboardingTitle: { color: "#FFFFFF", fontSize: 28, lineHeight: 35, fontWeight: "700", textAlign: "center", marginBottom: 12 },
  onboardingBody: { color: "#A0A0A0", fontSize: 15, lineHeight: 22, textAlign: "center", paddingHorizontal: 20 },
  onboardingFooter: { marginTop: 30, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dots: { flexDirection: "row", alignItems: "center", gap: 7 },
  dot: { width: 7, height: 7, borderRadius: 5 },
  nextButton: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: Colors.light.tint, borderRadius: 14, minHeight: 50, paddingHorizontal: 19 },
  nextButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  onboardingFootnote: { textAlign: "center", fontSize: 11, marginTop: 20 },
  centerPage: { flex: 1, paddingHorizontal: 28, justifyContent: "space-between", paddingTop: 64, paddingBottom: 32 },
  welcomeBrand: { alignItems: "center", marginTop: 50 },
  welcomeLogo: { width: 88, height: 88, borderRadius: 22, marginBottom: 19 },
  welcomeTitle: { fontSize: 26, fontWeight: "700", lineHeight: 32, textAlign: "center", marginBottom: 9 },
  welcomeSubtitle: { fontSize: 14, textAlign: "center" },
  welcomeActions: { width: "100%" },
  buttonSpacer: { height: 10 },
  primaryButton: { backgroundColor: Colors.light.tint, minHeight: 52, borderRadius: 14, alignItems: "center", justifyContent: "center", marginTop: 14 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  secondaryButton: { minHeight: 50, borderRadius: 14, alignItems: "center", justifyContent: "center", marginTop: 10 },
  secondaryButtonText: { fontSize: 15, fontWeight: "600" },
  termsText: { textAlign: "center", fontSize: 11, lineHeight: 18, marginTop: 19, paddingHorizontal: 10 },
  linkText: { color: Colors.light.tint, fontWeight: "700" },
  authPage: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 14, paddingBottom: 28 },
  backButton: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 18 },
  authHeading: { alignItems: "center", marginBottom: 24 },
  authLogo: { width: 58, height: 58, borderRadius: 16, marginBottom: 14 },
  sectionTitle: { fontSize: 21, fontWeight: "700" },
  bodyText: { fontSize: 13, lineHeight: 19 },
  fieldGroup: { marginBottom: 14 },
  fieldLabel: { fontSize: 13, fontWeight: "600", marginBottom: 7 },
  inputWrap: { minHeight: 48, borderWidth: 1, borderRadius: 12, paddingHorizontal: 13, flexDirection: "row", alignItems: "center" },
  textInput: { flex: 1, fontSize: 14, paddingVertical: 11 },
  forgotButton: { alignSelf: "flex-end", marginTop: -4, marginBottom: 4 },
  errorText: { color: Colors.danger, fontSize: 13, marginVertical: 6 },
  mockHint: { fontSize: 12, lineHeight: 17, marginTop: 2, marginBottom: 5 },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 20, marginBottom: 16 },
  divider: { flex: 1, height: 1 },
  dividerText: { fontSize: 12 },
  googleButton: { height: 49, borderRadius: 13, borderWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  googleG: { color: "#4285F4", fontSize: 17, fontWeight: "700" },
  googleButtonText: { fontSize: 14, fontWeight: "600" },
  disabledButton: { opacity: 0.55 },
  authSwitchText: { textAlign: "center", fontSize: 13, marginTop: 22 },
  homeContent: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 10 },
  homeHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 19 },
  userGreeting: { flexDirection: "row", alignItems: "center", gap: 11 },
  avatar: { width: 43, height: 43, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "#CDE9DE" },
  avatarInitial: { color: "#3A4F4A", fontSize: 17, fontWeight: "700" },
  eyebrow: { fontSize: 10, letterSpacing: 0.35 },
  userName: { fontSize: 17, fontWeight: "700", marginTop: 1 },
  headerIconButton: { width: 42, height: 42, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  notificationDot: { position: "absolute", width: 7, height: 7, borderRadius: 5, backgroundColor: Colors.danger, top: 9, right: 10 },
  pointsCard: { backgroundColor: Colors.light.surfaceSlate, borderRadius: 20, padding: 19, marginBottom: 24 },
  pointsCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  pointsEyebrow: { color: "#C9D5D1", fontSize: 10, letterSpacing: 1 },
  pointsValue: { color: "#FFFFFF", fontSize: 31, fontWeight: "700", marginTop: 5 },
  pointsUnit: { fontSize: 14, fontWeight: "500", color: "#D3F4ED" },
  pointsIcon: { width: 44, height: 44, borderRadius: 15, backgroundColor: "#FFFFFF1F", alignItems: "center", justifyContent: "center" },
  pointsProgress: { height: 6, backgroundColor: "#FFFFFF2F", borderRadius: 5, marginTop: 14, overflow: "hidden" },
  pointsProgressFill: { width: "68%", height: 6, backgroundColor: Colors.brandAccent, borderRadius: 5 },
  pointsCardBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 },
  pointsHint: { color: "#D3F4ED", fontSize: 11 },
  sectionHeading: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  seeAll: { color: Colors.light.tint, fontSize: 13, fontWeight: "700" },
  cardGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 12, marginBottom: 25 },
  loyaltyTile: { width: "48.3%", borderRadius: 16, padding: 11, minHeight: 102, justifyContent: "space-between" },
  loyaltyLogo: { height: 55, borderRadius: 12, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  loyaltyLogoText: { textAlign: "center", fontWeight: "800", fontSize: 13 },
  loyaltyPoints: { fontSize: 10, marginTop: 8 },
  addTile: { width: "48.3%", minHeight: 102, borderWidth: 1, borderStyle: "dashed", borderRadius: 16, alignItems: "center", justifyContent: "center", gap: 7 },
  addTileIcon: { width: 29, height: 29, borderRadius: 10, backgroundColor: Colors.light.tint, alignItems: "center", justifyContent: "center" },
  addTileText: { fontSize: 12, fontWeight: "600" },
  quickActions: { flexDirection: "row", gap: 10 },
  quickAction: { flex: 1, borderRadius: 15, minHeight: 84, alignItems: "center", justifyContent: "center", gap: 8 },
  quickActionIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: "#238C7B1A", alignItems: "center", justifyContent: "center" },
  quickActionLabel: { fontSize: 10, fontWeight: "600" },
  bottomNav: { minHeight: 70, flexDirection: "row", alignItems: "center", justifyContent: "space-around", paddingTop: 7, paddingBottom: Platform.OS === "ios" ? 4 : 8 },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center", gap: 3 },
  navIconWrap: { minWidth: 48, height: 29, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  navIconSelected: { backgroundColor: Colors.light.tint },
  navLabel: { fontSize: 10, fontWeight: "600" },
  pageContent: { paddingHorizontal: 20, paddingTop: 17, paddingBottom: 28 },
  pageHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  smallAddButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: Colors.light.tint, alignItems: "center", justifyContent: "center" },
  filterPills: { flexDirection: "row", gap: 8, marginBottom: 17 },
  filterPillActive: { backgroundColor: Colors.light.surfaceSlate, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 9 },
  filterPillActiveText: { color: "#FFFFFF", fontSize: 12, fontWeight: "600" },
  filterPill: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 9 },
  filterPillText: { fontSize: 12, fontWeight: "600" },
  addWideButton: { minHeight: 50, borderRadius: 14, backgroundColor: "#238C7B12", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9 },
  addWideText: { color: Colors.light.tint, fontSize: 14, fontWeight: "700" },
  editorTitle: { marginTop: 2, marginBottom: 7 },
  editorIntro: { marginBottom: 20 },
  cardPreview: { minHeight: 176, borderRadius: 20, padding: 20, alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
  cardPreviewBrand: { alignSelf: "flex-start", fontSize: 18, fontWeight: "800", color: "#FFFFFF" },
  cardPreviewNumber: { fontSize: 12, letterSpacing: 1.2 },
  colorChoices: { flexDirection: "row", gap: 10, marginTop: 10, marginBottom: 16 },
  colorSwatch: { width: 32, height: 32, borderRadius: 12, borderWidth: 2 },
  saveCardButton: { marginTop: 10 },
  detailCard: { minHeight: 230, borderRadius: 20, padding: 22, alignItems: "center", justifyContent: "space-between", marginVertical: 20 },
  pointsSummary: { borderRadius: 16, padding: 17, gap: 6, marginBottom: 12 },
  dangerButton: { minHeight: 49, borderWidth: 1, borderRadius: 14, alignItems: "center", justifyContent: "center", marginTop: 12 },
  dangerButtonText: { color: Colors.danger, fontSize: 14, fontWeight: "700" },
  historyBalance: { minHeight: 105, borderRadius: 17, justifyContent: "center", alignItems: "center", gap: 8 },
  historyBalanceValue: { fontSize: 24, fontWeight: "700", color: Colors.light.tint },
  activityRow: { minHeight: 72, borderBottomWidth: 1, flexDirection: "row", alignItems: "center", gap: 11 },
  activityIcon: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  activityCopy: { flex: 1, gap: 4 },
  activityStore: { fontSize: 13, fontWeight: "700" },
  activityAmount: { fontSize: 12, fontWeight: "700" },
  profileHeader: { alignItems: "center", paddingVertical: 17, marginBottom: 18 },
  profileAvatar: { width: 78, height: 78, borderRadius: 27, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  profileAvatarText: { color: Colors.brandAccent, fontSize: 25, fontWeight: "700" },
  profileName: { fontSize: 20, fontWeight: "700", marginBottom: 4 },
  profileMenu: { borderRadius: 17, paddingHorizontal: 15, paddingTop: 12, marginBottom: 19 },
  menuEyebrow: { marginHorizontal: 2, marginBottom: 5, fontWeight: "700", letterSpacing: 0.8 },
  menuRow: { minHeight: 51, flexDirection: "row", alignItems: "center", gap: 11, borderBottomWidth: StyleSheet.hairlineWidth },
  menuLabel: { flex: 1, fontSize: 13, fontWeight: "500" },
  signOutButton: { minHeight: 50, borderWidth: 1, borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  versionRow: { minHeight: 46, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  privacyNote: { flexDirection: "row", alignItems: "center", gap: 12, padding: 15, borderRadius: 15, marginTop: 18 },
  emptyState: { alignItems: "center", paddingVertical: 30, paddingHorizontal: 14 },
  emptyIcon: { width: 58, height: 58, borderRadius: 19, alignItems: "center", justifyContent: "center", marginBottom: 14 },
});
