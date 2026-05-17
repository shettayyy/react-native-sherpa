import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { TourStep } from 'react-native-sherpa';

import { colors, spacing, typography } from '@shared/styles';

const FILTERS = ['All', 'Electronics', 'Clothing', 'Home', 'Sports'];

interface FilterBarProps {
  tourId: string;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

/** Horizontally scrollable category filter strip. */
export function FilterBar({
  tourId,
  activeFilter,
  onFilterChange,
}: Readonly<FilterBarProps>) {
  return (
    <TourStep
      tourId={tourId}
      name="filter-bar"
      order={2}
      tooltipPlacement="bottom"
      content={{
        type: 'text',
        title: 'Filter by Category',
        body: 'Tap a category to narrow results. Only items in that category are shown.',
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.strip}
      >
        {FILTERS.map((filter) => {
          const active = filter === activeFilter;
          return (
            <TouchableOpacity
              key={filter}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onFilterChange(filter)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text
                style={[styles.chipLabel, active && styles.chipLabelActive]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
        <View style={styles.endPad} />
      </ScrollView>
    </TourStep>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chip: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border.subtle,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    backgroundColor: colors.background.card,
  },
  chipActive: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  chipLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
  },
  chipLabelActive: {
    color: colors.text.inverse,
  },
  endPad: {
    width: spacing.xl,
  },
});
