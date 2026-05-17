import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TourProvider } from 'react-native-sherpa';

import { FAB } from '../shared/components/fab';

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <TourProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Basic Tour' }} />
          <Stack.Screen
            name="(modals)/examples"
            options={{ presentation: 'formSheet', headerShown: false }}
          />
          <Stack.Screen
            name="(examples)/multi-tour"
            options={{ title: 'Multiple Tours' }}
          />
          <Stack.Screen
            name="(examples)/tooltip-placement"
            options={{ title: 'Tooltip Placement' }}
          />
          <Stack.Screen
            name="(examples)/custom-tooltip"
            options={{ title: 'Custom Tooltip' }}
          />
          <Stack.Screen
            name="(examples)/theming"
            options={{ title: 'Theming' }}
          />
          <Stack.Screen
            name="(examples)/scrollable-tour"
            options={{ title: 'Scrollable Tour' }}
          />
        </Stack>
        <FAB />
      </TourProvider>
    </GestureHandlerRootView>
  );
}
