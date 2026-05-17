import { StyleSheet, Text, View } from 'react-native';
import { TourStep } from 'react-native-sherpa';

import { colors, spacing, typography } from '@shared/styles';

interface PromoBannerProps {
  tourId: string;
}

/** Hero banner at the top of the scrollable tour screen. */
export function PromoBanner({ tourId }: Readonly<PromoBannerProps>) {
  return (
    <TourStep
      tourId={tourId}
      name="promo-banner"
      order={1}
      tooltipPlacement="bottom"
      content={{
        type: 'text',
        title: 'Featured Deals',
        body: 'Featured deals refresh daily. Check back every morning for new offers.',
      }}
    >
      <View style={styles.banner}>
        <Text style={styles.tag}>LIMITED TIME</Text>
        <Text style={styles.headline}>Up to 40% off this week</Text>
        <Text style={styles.sub}>Ends Sunday at midnight</Text>
      </View>
    </TourStep>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.brand.primary,
    borderRadius: 16,
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.xl,
    gap: spacing.xs,
  },
  tag: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
  },
  headline: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.text.inverse,
  },
  sub: {
    fontSize: typography.size.sm,
    color: 'rgba(255,255,255,0.8)',
  },
});
