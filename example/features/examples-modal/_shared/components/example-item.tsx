import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@shared/styles';

interface ExampleItemProps {
  title: string;
  description: string;
  onPress: () => void;
  showBorder: boolean;
}

export function ExampleItem({
  title,
  description,
  onPress,
  showBorder,
}: Readonly<ExampleItemProps>) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.item,
        showBorder && styles.border,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={colors.text.hint} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  pressed: {
    opacity: 0.6,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: 2,
  },
  description: {
    fontSize: typography.size.sm,
    color: colors.text.muted,
    lineHeight: typography.lineHeight.tight,
  },
});
