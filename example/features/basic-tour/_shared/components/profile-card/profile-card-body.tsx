import { StyleSheet, Text } from 'react-native';
import { TourStep } from 'react-native-sherpa';

import { colors, spacing, typography } from '@shared/styles';

interface ProfileCardBodyProps {
  bio: string;
}

export function ProfileCardBody({ bio }: Readonly<ProfileCardBodyProps>) {
  return (
    <TourStep
      tourId="basic-tour"
      name="bio"
      order={3}
      tooltipPlacement="top"
      content={{
        type: 'text',
        title: 'Your Bio',
        body: 'Write a short bio to tell people what you are about.',
      }}
    >
      <Text style={styles.bio}>{bio}</Text>
    </TourStep>
  );
}

const styles = StyleSheet.create({
  bio: {
    fontSize: typography.size.md,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.relaxed,
    marginBottom: spacing.xl,
  },
});
