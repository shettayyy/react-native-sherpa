import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@shared/styles';

interface CollapsibleGroupProps {
  /** Unique key used to persist the expanded/collapsed preference. */
  storageKey: string;
  label: string;
  description?: string;
  /** Rendered open by default until the user collapses it. */
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

/**
 * A pressable group header that expands/collapses its children.
 * Persists the user's preference via AsyncStorage so the state survives
 * app restarts.
 *
 * @example
 * <CollapsibleGroup storageKey="examples:scrollable" label="Scrollable" description="...">
 *   <ExampleItem ... />
 * </CollapsibleGroup>
 */
export function CollapsibleGroup({
  storageKey,
  label,
  description,
  defaultExpanded = true,
  children,
}: Readonly<CollapsibleGroupProps>) {
  const [isExpanded, setIsExpanded] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(storageKey)
      .then((stored) => {
        const resolved = stored === null ? defaultExpanded : stored === 'true';
        setIsExpanded(resolved);
      })
      .catch(() => {});
  }, [storageKey, defaultExpanded]);

  function toggle() {
    if (isExpanded === null) return;
    const next = !isExpanded;
    setIsExpanded(next);
    AsyncStorage.setItem(storageKey, String(next)).catch(() => {});
  }

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={({ pressed }) => [styles.header, pressed && styles.pressed]}
        onPress={toggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded ?? defaultExpanded }}
      >
        <View style={styles.labelRow}>
          <View style={styles.badge}>
            <Feather name="layers" size={13} color={colors.brand.primary} />
          </View>
          <View style={styles.labelBlock}>
            <Text style={styles.label}>{label}</Text>
            {description !== undefined && (
              <Text style={styles.description}>{description}</Text>
            )}
          </View>
        </View>
        <Feather
          name="chevron-right"
          size={18}
          color={isExpanded ? colors.brand.primary : colors.text.hint}
        />
      </Pressable>

      {isExpanded && <View style={styles.children}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  pressed: {
    opacity: 0.6,
  },
  labelRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  badge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: `${colors.brand.primary}18`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelBlock: {
    flex: 1,
  },
  label: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  description: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
    marginTop: 2,
  },
  children: {
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    paddingHorizontal: spacing.lg,
  },
});
