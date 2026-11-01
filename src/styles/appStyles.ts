import { Platform, StyleSheet, ViewStyle } from "react-native"; // Added ViewStyle
import { Colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  errorContainer: { paddingHorizontal: 20, paddingTop: 12 },
  
  // --- Onboarding Fixes ---
  onboarding: { flex: 1, paddingHorizontal: 0, paddingTop: 20, paddingBottom: 24 },
  onboardingTop: { height: 48, flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginTop: 15, paddingHorizontal: 24 },
  skip: { color: "#A0A0A0", fontSize: 14, fontWeight: "600" },
  illustrationArea: { flex: 0.8, minHeight: 220, alignItems: "center", justifyContent: "center" },
  onboardingTitle: { color: "#FFFFFF", fontSize: 24, lineHeight: 32, fontWeight: "700", textAlign: "center", marginBottom: 12, paddingHorizontal: 24 },
  onboardingBody: { color: "#A0A0A0", fontSize: 15, lineHeight: 22, textAlign: "center", paddingHorizontal: 32 },
  onboardingFooter: { marginTop: 24, flexDirection: "column", gap: 16, justifyContent: "center", alignItems: "center" },
  dots: { flexDirection: "row", alignItems: "center", gap: 7 },
  dot: { width: 7, height: 7, borderRadius: 5 },
  nextButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: Colors.light.tint, borderRadius: 14, minHeight: 50, width: "85%", maxWidth: 300 },
  nextButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  onboardingFootnote: { textAlign: "center", fontSize: 11, marginTop: 16 },

   // --- 3D Reward Illustration ---
  rewardStack: { 
    width: 350, 
    height: 350, 
    alignItems: "center", 
    justifyContent: "center", 
    marginTop: 20, 
  },
  rewardCard: { 
    position: "absolute", 
    width: 240, // Standard credit card aspect ratio
    height: 150, 
    borderRadius: 16, 
    // Removed padding here so the background image goes edge-to-edge
    shadowColor: "#000", 
    shadowOpacity: 0.4, 
    shadowRadius: 15, 
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
    backfaceVisibility: "hidden",
  },
  // 1. Top-Left Card (Back)
  rewardBack: { 
    transform: [
      { perspective: 1000 },
      { translateX: -45 },   
      { translateY: -120 },   
      { rotateZ: "-20deg" },
      { rotateY: "25deg" },
      { rotateX: "10deg" }
    ] as ViewStyle['transform']
  },
  // 2. Middle Right Card
  rewardMiddle: { 
    transform: [
      { perspective: 1000 },
      { translateX: 15 },    
      { translateY: 18 },   
      { rotateZ: "15deg" },
      { rotateY: "-25deg" },
      { rotateX: "5deg" }
    ] as ViewStyle['transform']
  },
  // 3. Bottom Front Card
  rewardFront: { 
    transform: [
      { perspective: 1000 },
      { translateX: -15 },     
      { translateY: 130 },    
      { rotateZ: "-15deg" },
      { rotateY: "28deg" },
      { rotateX: "45deg" }
    ] as ViewStyle['transform']
  },
  rewardBrand: { fontSize: 20, fontWeight: "900", color: "#FFFFFF", letterSpacing: 1 },
  rewardIcons: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  pointsText: { fontSize: 9, fontWeight: "700", color: "#D4D4D4", letterSpacing: 1.4 },

  // --- Welcome / Auth ---
  centerPage: { flex: 1, paddingHorizontal: 28, justifyContent: "space-between", paddingTop: 64, paddingBottom: 32 },
  welcomeBrand: { alignItems: "center", marginTop: 50 },
  welcomeLogo: { width: 88, height: 88, borderRadius: 22, marginBottom: 19 },
  welcomeTitle: { fontSize: 26, fontWeight: "700", lineHeight: 32, textAlign: "center", marginBottom: 9 },
  welcomeSubtitle: { fontSize: 14, textAlign: "center" },
  welcomeActions: { width: "100%" },
  buttonSpacer: { height: 10 },
  termsText: { textAlign: "center", fontSize: 11, lineHeight: 18, marginTop: 19, paddingHorizontal: 10 },
  linkText: { color: Colors.light.tint, fontWeight: "700" },
  
  authPage: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 14, paddingBottom: 28 },
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

  // --- Home ---
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
  pointsProgressFill: { width: "68%", height: 6, backgroundColor: "#3DDAC0", borderRadius: 5 },
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

  // --- Bottom Nav ---
  bottomNav: { minHeight: 70, flexDirection: "row", alignItems: "center", justifyContent: "space-around", paddingTop: 7, paddingBottom: Platform.OS === "ios" ? 4 : 8 },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center", gap: 3 },
  navIconWrap: { minWidth: 48, height: 29, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  navIconSelected: { backgroundColor: Colors.light.tint },
  navLabel: { fontSize: 10, fontWeight: "600" },

  // --- Page / Cards ---
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

  // --- Editor / Detail ---
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

  // --- History ---
  historyBalance: { minHeight: 105, borderRadius: 17, justifyContent: "center", alignItems: "center", gap: 8 },
  historyBalanceValue: { fontSize: 24, fontWeight: "700", color: Colors.light.tint },
  activityRow: { minHeight: 72, borderBottomWidth: 1, flexDirection: "row", alignItems: "center", gap: 11 },
  activityIcon: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  activityCopy: { flex: 1, gap: 4 },
  activityStore: { fontSize: 13, fontWeight: "700" },
  activityAmount: { fontSize: 12, fontWeight: "700" },

  // --- Profile ---
  profileHeader: { alignItems: "center", paddingVertical: 17, marginBottom: 18 },
  profileAvatar: { width: 78, height: 78, borderRadius: 27, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  profileAvatarText: { color: "#004852", fontSize: 25, fontWeight: "700" },
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