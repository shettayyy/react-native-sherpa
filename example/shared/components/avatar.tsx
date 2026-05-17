import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@shared/styles';

interface AvatarProps {
  initials: string;
  size?: number;
}

export function Avatar({ initials, size = 56 }: Readonly<AvatarProps>) {
  const radius = size / 2;
  const fontSize = size * 0.36;

  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: radius },
      ]}
    >
      <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.text.inverse,
    fontWeight: typography.weight.bold,
  },
});
