import { useState } from "react";
import { ScrollView, Text } from "react-native";
import { Colors } from "../../../theme/colors";
import { BackButton, Button, FormField } from "../../components";
import { styles } from "../../styles/appStyles";
import type { UserProfile } from "../../types/models";

type Props = {
  palette: (typeof Colors)["light"];
  profile: UserProfile | null;
  isSaving: boolean;
  error: string;
  onBack: () => void;
  onSave: (fullName: string, email: string) => void;
};

export function ProfileEditScreen({ palette, profile, isSaving, error, onBack, onSave }: Props) {
  const [fullName, setFullName] = useState(profile?.fullName ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.pageContent}>
      <BackButton palette={palette} onPress={onBack} />
      <Text style={[styles.sectionTitle, styles.editorTitle, { color: palette.text }]}>Personal Information</Text>
      <Text style={[styles.bodyText, styles.editorIntro, { color: palette.textSecondary }]}>
        Update the details connected to your account.
      </Text>
      <FormField label="Full name" value={fullName} onChangeText={setFullName} placeholder="Your name" palette={palette} autoCapitalize="words" />
      <FormField label="Email address" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" palette={palette} />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button title="Save profile" onPress={() => onSave(fullName, email)} loading={isSaving} />
    </ScrollView>
  );
}