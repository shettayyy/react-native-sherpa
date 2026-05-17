import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@shared/styles';

interface TargetBoxProps {
  label: string;
}

/** A small labelled box used as a tour highlight target. */
export function TargetBox({ label }: Readonly<TargetBoxProps>) {
  return (
    <View style={styles.box}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.background.card,
    borderWidth: 1.5,
    borderColor: colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.brand.primary,
  },
});
