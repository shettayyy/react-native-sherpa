import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  useReducedMotion,
  Easing,
} from 'react-native-reanimated';

import type {
  ElementMeasurement,
  TourStatus,
  SherpaTheme,
  StepRegistration,
} from '@sherpa/types';
import { buildSvgPath } from '@sherpa/utilities';
import type { BuildSvgPathParams } from '@sherpa/utilities';

const FADE_DURATION = 250;
const SPRING_CONFIG = { damping: 20, stiffness: 180 };
const BEACON_DURATION = 900;
const BEACON_MIN_SCALE = 1;
const BEACON_MAX_SCALE = 1.6;
const BEACON_MIN_OPACITY = 0.7;
const BEACON_MAX_OPACITY = 0;

type UseOverlayAnimationParams = {
  measurement: ElementMeasurement;
  currentStep: StepRegistration;
  status: TourStatus;
  canvasWidth: number;
  canvasHeight: number;
  maskPadding: number;
  maskBorderRadius: number;
  theme: SherpaTheme;
};

export function useOverlayAnimation({
  measurement,
  currentStep,
  status,
  canvasWidth,
  canvasHeight,
  maskPadding,
  maskBorderRadius,
  theme,
}: UseOverlayAnimationParams) {
  const reducedMotion = useReducedMotion();
  const duration = reducedMotion ? 0 : FADE_DURATION;

  // Backdrop
  const backdropOpacity = useSharedValue(0);

  // Mask hole coordinates
  const maskX = useSharedValue(measurement.pageX);
  const maskY = useSharedValue(measurement.pageY);
  const maskW = useSharedValue(measurement.width);
  const maskH = useSharedValue(measurement.height);

  // Beacon
  const beaconScale = useSharedValue(BEACON_MIN_SCALE);
  const beaconOpacity = useSharedValue(BEACON_MIN_OPACITY);

  // Animate backdrop in/out based on status
  useEffect(() => {
    const isVisible = status === 'running' || status === 'transitioning';
    backdropOpacity.value = withTiming(isVisible ? 1 : 0, { duration });
  }, [status, backdropOpacity, duration]);

  // Animate mask to new measurement on step change
  useEffect(() => {
    const springOrInstant = <T extends number>(to: T) =>
      reducedMotion ? to : withSpring(to, SPRING_CONFIG);

    maskX.value = springOrInstant(measurement.pageX);
    maskY.value = springOrInstant(measurement.pageY);
    maskW.value = springOrInstant(measurement.width);
    maskH.value = springOrInstant(measurement.height);
  }, [measurement, maskX, maskY, maskW, maskH, reducedMotion]);

  // Beacon pulse loop — reset and restart on each step
  useEffect(() => {
    if (reducedMotion) {
      beaconScale.value = BEACON_MIN_SCALE;
      beaconOpacity.value = 0;
      return;
    }

    beaconScale.value = BEACON_MIN_SCALE;
    beaconOpacity.value = BEACON_MIN_OPACITY;

    beaconScale.value = withRepeat(
      withTiming(BEACON_MAX_SCALE, {
        duration: BEACON_DURATION,
        easing: Easing.out(Easing.ease),
      }),
      -1,
      false
    );

    beaconOpacity.value = withRepeat(
      withSequence(
        withTiming(BEACON_MAX_OPACITY, {
          duration: BEACON_DURATION,
          easing: Easing.out(Easing.ease),
        }),
        withTiming(BEACON_MIN_OPACITY, { duration: 0 })
      ),
      -1,
      false
    );
  }, [measurement, beaconScale, beaconOpacity, reducedMotion]);

  const maskShape = currentStep.maskShape ?? 'rounded-rect';

  // SVG path derived on the UI thread from animated hole coords
  const animatedSvgPath = useDerivedValue(() => {
    'worklet';
    const params: BuildSvgPathParams = {
      pageX: maskX.value,
      pageY: maskY.value,
      width: maskW.value,
      height: maskH.value,
      canvasWidth,
      canvasHeight,
      maskShape,
      maskPadding,
      maskBorderRadius,
    };
    return buildSvgPath(params, currentStep, currentStep.customMaskPath);
  });

  // Beacon geometry derived from animated mask coords
  const beaconCx = useDerivedValue(() => {
    'worklet';
    return maskX.value + maskW.value / 2;
  });
  const beaconCy = useDerivedValue(() => {
    'worklet';
    return maskY.value + maskH.value / 2;
  });
  const beaconBaseRadius = useDerivedValue(() => {
    'worklet';
    return Math.max(maskW.value, maskH.value) / 2 + maskPadding;
  });
  const beaconRadius = useDerivedValue(() => {
    'worklet';
    return beaconBaseRadius.value * beaconScale.value;
  });

  const beaconColor = theme.beacon.color;

  const animatedPathProps = useAnimatedProps(() => ({
    d: animatedSvgPath.value,
  }));

  const animatedBeaconProps = useAnimatedProps(() => ({
    cx: beaconCx.value,
    cy: beaconCy.value,
    r: beaconRadius.value,
    opacity: beaconOpacity.value,
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return {
    animatedPathProps,
    animatedBeaconProps,
    animatedBackdropStyle,
    beaconColor,
  };
}
