import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CollapsibleGroup } from '@shared/components/collapsible-group';
import { colors, spacing, typography } from '@shared/styles';
import { ExampleItem } from './_shared/components/example-item';

const EXAMPLES = [
  {
    route: '/' as const,
    title: 'Basic Tour',
    description: 'Linear single-screen tour spotlighting key UI elements.',
  },
  {
    route: '/(examples)/multi-tour' as const,
    title: 'Multiple Tours',
    description: 'Two independent named tours running on the same screen.',
  },
  {
    route: '/(examples)/tooltip-placement' as const,
    title: 'Tooltip Placement',
    description: 'Auto-placement logic adapting to elements near screen edges.',
  },
  {
    route: '/(examples)/custom-tooltip' as const,
    title: 'Custom Tooltip',
    description: 'Swapping the default tooltip with a fully custom component.',
  },
  {
    route: '/(examples)/theming' as const,
    title: 'Theming',
    description: 'Light and custom dark theme passed through TourProvider.',
  },
] as const;

const SCROLLABLE_EXAMPLES = [
  {
    route: '/(examples)/scrollable-tour' as const,
    title: 'Scrollable Tour',
    description: 'Tour steps spread across a long scrollable page.',
  },
] as const;

export function ExamplesModalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  function navigate(
    route:
      | (typeof EXAMPLES)[number]['route']
      | (typeof SCROLLABLE_EXAMPLES)[number]['route']
  ) {
    router.dismiss();
    router.push(route);
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingBottom: insets.bottom + spacing.lg },
      ]}
    >
      <Text style={styles.heading}>Examples</Text>

      <View style={styles.card}>
        {EXAMPLES.map((example, index) => (
          <ExampleItem
            key={example.route}
            title={example.title}
            description={example.description}
            onPress={() => navigate(example.route)}
            showBorder={index < EXAMPLES.length - 1}
          />
        ))}
      </View>

      <CollapsibleGroup
        storageKey="examples:scrollable"
        label="Scrollable"
        description="Tours that scroll the screen to bring steps into view."
      >
        {SCROLLABLE_EXAMPLES.map((example, index) => (
          <ExampleItem
            key={example.route}
            title={example.title}
            description={example.description}
            onPress={() => navigate(example.route)}
            showBorder={index < SCROLLABLE_EXAMPLES.length - 1}
          />
        ))}
      </CollapsibleGroup>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background.modal,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['2xl'],
  },
  heading: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  card: {
    borderRadius: 12,
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    paddingHorizontal: spacing.lg,
    overflow: 'hidden',
  },
});
