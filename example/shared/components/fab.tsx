import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  createAnimatedComponent,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TourStep } from 'react-native-sherpa';

import { colors, spacing } from '@shared/styles';

const AnimatedView = createAnimatedComponent(View);

const FAB_SIZE = 52;
const EDGE_MARGIN = spacing.xl;
const DRAG_THRESHOLD = 10;
const MOMENTUM_FACTOR = 0.35;

const DRAG_SPRING = { mass: 0.5, damping: 20, stiffness: 300 };
const SNAP_SPRING = { mass: 0.8, damping: 14, stiffness: 120 };

/**
 * Floating action button that opens the examples modal on tap and can be
 * freely dragged to any position. Snaps to the nearest screen edge on release.
 */
export function FAB() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const minX = EDGE_MARGIN;
  const maxX = screenWidth - FAB_SIZE - EDGE_MARGIN;
  const minY = insets.top + EDGE_MARGIN;
  const maxY = screenHeight - FAB_SIZE - insets.bottom - EDGE_MARGIN;

  const posX = useSharedValue(maxX);
  const posY = useSharedValue(maxY - spacing['2xl']);
  const startX = useSharedValue(maxX);
  const startY = useSharedValue(maxY - spacing['2xl']);
  const isDragging = useSharedValue(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: posX.value },
      { translateY: posY.value },
      { scale: scale.value },
    ],
  }));

  if (pathname === '/examples') return null;

  function openExamples() {
    router.push('/(modals)/examples');
  }

  // Pan only activates once the finger has moved enough to be a real drag.
  // Below that threshold the tap gesture wins instead.
  const pan = Gesture.Pan()
    .minDistance(DRAG_THRESHOLD)
    .onStart(() => {
      startX.value = posX.value;
      startY.value = posY.value;
      isDragging.value = true;
      scale.value = withSpring(1.08, DRAG_SPRING);
    })
    .onUpdate((e) => {
      posX.value = Math.min(
        Math.max(startX.value + e.translationX, minX),
        maxX
      );
      posY.value = Math.min(
        Math.max(startY.value + e.translationY, minY),
        maxY
      );
    })
    .onEnd((e) => {
      isDragging.value = false;
      scale.value = withSpring(1, SNAP_SPRING);

      const projectedX = posX.value + e.velocityX * MOMENTUM_FACTOR;
      const projectedY = posY.value + e.velocityY * MOMENTUM_FACTOR;
      const snapRight = projectedX + FAB_SIZE / 2 > screenWidth / 2;

      posX.value = withSpring(snapRight ? maxX : minX, SNAP_SPRING);
      posY.value = withSpring(
        Math.min(Math.max(projectedY, minY), maxY),
        SNAP_SPRING
      );
    });

  const tap = Gesture.Tap()
    .runOnJS(true)
    .onEnd(() => {
      openExamples();
    });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <TourStep
        tourId="basic-tour"
        name="fab"
        order={5}
        tooltipPlacement="top"
        maskShape="circle"
        content={{
          type: 'text',
          title: 'Explore Examples',
          body: 'Tap this button any time to browse all available tour examples.',
        }}
      >
        <GestureDetector gesture={Gesture.Exclusive(pan, tap)}>
          <AnimatedView style={[styles.button, animatedStyle]}>
            <MaterialCommunityIcons
              name="view-list"
              size={28}
              color={colors.text.inverse}
            />
          </AnimatedView>
        </GestureDetector>
      </TourStep>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
});
