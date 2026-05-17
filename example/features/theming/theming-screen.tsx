import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@shared/styles';

export function ThemingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Theming</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.screen,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
});
