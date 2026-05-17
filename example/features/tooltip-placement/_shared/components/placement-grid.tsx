import { StyleSheet, View } from 'react-native';
import { TourStep } from 'react-native-sherpa';

import { spacing } from '@shared/styles';
import { TargetBox } from './target-box';

const TOUR_ID = 'tooltip-placement';

/**
 * Middle section of the tooltip placement screen.
 *
 * Left column: far-left edge boxes (right honoured, left fallback).
 * Center grid: four boxes demonstrating top/bottom/left/right from a centred position.
 * Right column: far-right edge boxes (left honoured, right fallback).
 */
export function PlacementGrid() {
  return (
    <View style={styles.row}>
      {/* Left column — at the far-left edge */}
      <View style={styles.column}>
        <TourStep
          tourId={TOUR_ID}
          name="far-left-right"
          order={3}
          tooltipPlacement="right"
          content={{
            type: 'text',
            title: 'Requested: right — honoured',
            body: 'Plenty of room to the right. The tooltip lands exactly where requested.',
          }}
        >
          <TargetBox label="right" />
        </TourStep>

        <TourStep
          tourId={TOUR_ID}
          name="near-left"
          order={5}
          tooltipPlacement="left"
          content={{
            type: 'text',
            title: 'Requested: left — fallback',
            body: 'Not enough room on the left. The library fell back to the best available side.',
          }}
        >
          <TargetBox label="left" />
        </TourStep>
      </View>

      {/* Center grid */}
      <View style={styles.grid}>
        <View style={styles.gridRow}>
          <TourStep
            tourId={TOUR_ID}
            name="center-top"
            order={7}
            tooltipPlacement="top"
            content={{
              type: 'text',
              title: 'Requested: top — honoured',
              body: 'Plenty of room above. The tooltip lands exactly where requested.',
            }}
          >
            <TargetBox label="top" />
          </TourStep>

          <TourStep
            tourId={TOUR_ID}
            name="center-right"
            order={9}
            tooltipPlacement="right"
            content={{
              type: 'text',
              title: 'Requested: right — fallback',
              body: 'Not enough horizontal space. The library fell back to the best available side.',
            }}
          >
            <TargetBox label="right" />
          </TourStep>
        </View>

        <View style={styles.gridRow}>
          <TourStep
            tourId={TOUR_ID}
            name="center-left"
            order={8}
            tooltipPlacement="left"
            content={{
              type: 'text',
              title: 'Requested: left — fallback',
              body: 'Not enough horizontal space. The library fell back to the best available side.',
            }}
          >
            <TargetBox label="left" />
          </TourStep>

          <TourStep
            tourId={TOUR_ID}
            name="center-bottom"
            order={10}
            tooltipPlacement="bottom"
            content={{
              type: 'text',
              title: 'Requested: bottom — honoured',
              body: 'Plenty of room below. The tooltip lands exactly where requested.',
            }}
          >
            <TargetBox label="bottom" />
          </TourStep>
        </View>
      </View>

      {/* Right column — at the far-right edge */}
      <View style={styles.column}>
        <TourStep
          tourId={TOUR_ID}
          name="far-right-left"
          order={4}
          tooltipPlacement="left"
          content={{
            type: 'text',
            title: 'Requested: left — honoured',
            body: 'Plenty of room to the left. The tooltip lands exactly where requested.',
          }}
        >
          <TargetBox label="left" />
        </TourStep>

        <TourStep
          tourId={TOUR_ID}
          name="near-right"
          order={6}
          tooltipPlacement="right"
          content={{
            type: 'text',
            title: 'Requested: right — fallback',
            body: 'Not enough room on the right. The library fell back to the best available side.',
          }}
        >
          <TargetBox label="right" />
        </TourStep>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flex: 1,
  },
  column: {
    gap: spacing.lg,
    alignItems: 'center',
  },
  grid: {
    gap: spacing.lg,
  },
  gridRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
});
