import { StyleSheet, Text, View } from 'react-native';
import { TourStep } from 'react-native-sherpa';

import { Avatar } from '@shared/components/avatar';
import { Button } from '@shared/components/button';
import { colors, spacing, typography } from '@shared/styles';

interface ProfileCardHeaderProps {
  initials: string;
  name: string;
  handle: string;
}

export function ProfileCardHeader({
  initials,
  name,
  handle,
}: Readonly<ProfileCardHeaderProps>) {
  return (
    <View style={styles.container}>
      <TourStep
        tourId="basic-tour"
        name="avatar"
        order={1}
        maskShape="circle"
        tooltipPlacement="top"
        content={{
          type: 'text',
          title: 'Your Avatar',
          body: 'Tap your avatar to update your profile picture.',
        }}
      >
        <Avatar initials={initials} />
      </TourStep>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.handle}>{handle}</Text>
      </View>
      <TourStep
        tourId="basic-tour"
        name="follow-button"
        order={2}
        tooltipPlacement="top"
        content={{
          type: 'text',
          title: 'Follow Button',
          body: 'Tap Follow to subscribe to updates from this profile.',
        }}
      >
        <Button label="Follow" />
      </TourStep>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  handle: {
    fontSize: typography.size.sm,
    color: colors.text.muted,
    marginTop: 2,
  },
});
