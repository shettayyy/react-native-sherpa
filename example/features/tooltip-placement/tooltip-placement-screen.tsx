import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TourStep, useTourActions } from 'react-native-sherpa';

import { Button } from '@shared/components/button';
import { colors, spacing, typography } from '@shared/styles';
import { PlacementGrid } from './_shared/components/placement-grid';
import { TargetBox } from './_shared/components/target-box';

const TOUR_ID = 'tooltip-placement';

export function TooltipPlacementScreen() {
  const insets = useSafeAreaInsets();
  const { start } = useTourActions();

  return (
    <View
      style={[styles.container, { paddingBottom: insets.bottom + spacing.xl }]}
    >
      <TourStep
        tourId={TOUR_ID}
        name="near-top"
        order={1}
        tooltipPlacement="top"
        content={{
          type: 'text',
          title: 'Requested: top — fallback',
          body: 'Not enough room above. The library fell back to bottom automatically.',
        }}
      >
        <TargetBox label="top" />
      </TourStep>

      <PlacementGrid />

      <TourStep
        tourId={TOUR_ID}
        name="near-bottom"
        order={2}
        tooltipPlacement="bottom"
        content={{
          type: 'text',
          title: 'Requested: bottom — fallback',
          body: 'Not enough room below. The library fell back to top automatically.',
        }}
      >
        <TargetBox label="bottom" />
      </TourStep>

      <View style={styles.footer}>
        <Button label="Start Tour" onPress={() => start(TOUR_ID)} />
        <Text style={styles.hint}>
          Outer boxes trigger fallback. Center boxes honour the requested
          placement.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.screen,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {
    width: '100%',
    gap: spacing.md,
    paddingTop: spacing.xl,
  },
  hint: {
    fontSize: typography.size.sm,
    color: colors.text.hint,
    textAlign: 'center',
    lineHeight: typography.lineHeight.normal,
  },
});
