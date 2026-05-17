import { StyleSheet, View } from 'react-native';

import { colors, shadows, spacing } from '@shared/styles';
import { ProfileCardBody } from './profile-card-body';
import { ProfileCardFooter } from './profile-card-footer';
import { ProfileCardHeader } from './profile-card-header';

const PROFILE = {
  initials: 'RS',
  name: 'Rahul Shetty',
  handle: '@shettayyy',
  bio: 'Building delightful mobile experiences. Creator of react-native-sherpa — the Swiss Army knife of in-app guidance for React Native.',
  stats: [
    { label: 'Posts', value: '128' },
    { label: 'Followers', value: '4.2k' },
    { label: 'Following', value: '312' },
  ],
};

export function ProfileCard() {
  return (
    <View style={styles.card}>
      <ProfileCardHeader
        initials={PROFILE.initials}
        name={PROFILE.name}
        handle={PROFILE.handle}
      />
      <ProfileCardBody bio={PROFILE.bio} />
      <ProfileCardFooter stats={PROFILE.stats} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: spacing.xl,
    ...shadows.sm,
    marginBottom: spacing['3xl'],
  },
});
