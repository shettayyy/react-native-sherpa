import { ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTourActions } from 'react-native-sherpa';

import { Button } from '@shared/components/button';
import { colors, spacing, typography } from '@shared/styles';
import { ProfileCard } from './_shared/components/profile-card/profile-card';

export function BasicTourScreen() {
  const insets = useSafeAreaInsets();
  const { start } = useTourActions();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingBottom: insets.bottom + 100 },
      ]}
    >
      <ProfileCard />
      <Button label="Start Tour" onPress={() => start('basic-tour')} />
      <Text style={styles.hint}>
        Tap &ldquo;Start Tour&rdquo; to see how react-native-sherpa highlights
        and guides users through your UI.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing.xl,
    backgroundColor: colors.background.screen,
  },
  hint: {
    fontSize: typography.size.sm,
    color: colors.text.hint,
    textAlign: 'center',
    lineHeight: typography.lineHeight.normal,
    marginTop: spacing.lg,
  },
});
