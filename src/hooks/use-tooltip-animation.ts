import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useReducedMotion,
} from 'react-native-reanimated';

const FADE_DURATION = 220;
const SLIDE_DISTANCE = 8;

export function useTooltipAnimation(stepIndex: number) {
  const reducedMotion = useReducedMotion();
  const duration = reducedMotion ? 0 : FADE_DURATION;

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(SLIDE_DISTANCE);

  useEffect(() => {
    opacity.value = 0;
    translateY.value = reducedMotion ? 0 : SLIDE_DISTANCE;

    opacity.value = withTiming(1, { duration });
    translateY.value = withTiming(0, { duration });
  }, [stepIndex, opacity, translateY, duration, reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return { animatedStyle };
}
