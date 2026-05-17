import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, spacing, typography } from '@shared/styles';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline';
}

export function Button({
  label,
  onPress,
  variant = 'primary',
}: Readonly<ButtonProps>) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primary : styles.outline,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <Text
        style={[
          styles.label,
          isPrimary ? styles.labelPrimary : styles.labelOutline,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    paddingHorizontal: spacing.lg + spacing.sm,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.brand.primary,
  },
  outline: {
    borderWidth: 1.5,
    borderColor: colors.brand.primary,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  label: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  labelPrimary: {
    color: colors.text.inverse,
  },
  labelOutline: {
    color: colors.brand.primary,
  },
});
