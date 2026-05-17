import { StyleSheet, Text, View } from 'react-native';
import { TourStep } from 'react-native-sherpa';

import { colors, spacing, typography } from '@shared/styles';

interface Stat {
  label: string;
  value: string;
}

interface ProfileCardFooterProps {
  stats: Stat[];
}

export function ProfileCardFooter({ stats }: Readonly<ProfileCardFooterProps>) {
  return (
    <TourStep
      tourId="basic-tour"
      name="stats"
      order={4}
      tooltipPlacement="top"
      content={{
        type: 'text',
        title: 'Your Stats',
        body: 'Posts, followers, and following counts update in real time.',
      }}
    >
      <View style={styles.container}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.stat}>
            <Text style={styles.value}>{stat.value}</Text>
            <Text style={styles.label}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </TourStep>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    paddingTop: spacing.lg,
  },
  stat: {
    alignItems: 'center',
  },
  value: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  label: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
    marginTop: 2,
  },
});
