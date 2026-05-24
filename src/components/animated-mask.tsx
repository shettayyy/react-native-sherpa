import Animated, { createAnimatedComponent } from 'react-native-reanimated';
import Svg, { Path, Circle } from 'react-native-svg';

import type {
  ElementMeasurement,
  TourStatus,
  SherpaTheme,
  StepRegistration,
  InteractionMode,
} from '@sherpa/types';
import { useOverlayAnimation } from '@sherpa/hooks';

const AnimatedPath = createAnimatedComponent(Path);
const AnimatedCircle = createAnimatedComponent(Circle);

const DEFAULT_MASK_PADDING = 8;
const DEFAULT_MASK_BORDER_RADIUS = 4;
const BEACON_STROKE_WIDTH = 2;

type AnimatedMaskProps = {
  measurement: ElementMeasurement;
  currentStep: StepRegistration;
  status: TourStatus;
  canvasWidth: number;
  canvasHeight: number;
  overlayColor: string;
  overlayOpacity: number;
  theme: SherpaTheme;
};

function resolvePointerEvents(mode: InteractionMode): 'none' | 'box-only' {
  return mode === 'blocking' ? 'box-only' : 'none';
}

export function AnimatedMask({
  measurement,
  currentStep,
  status,
  canvasWidth,
  canvasHeight,
  overlayColor,
  overlayOpacity,
  theme,
}: Readonly<AnimatedMaskProps>) {
  const maskPadding = currentStep.maskPadding ?? DEFAULT_MASK_PADDING;
  const maskBorderRadius =
    currentStep.maskBorderRadius ?? DEFAULT_MASK_BORDER_RADIUS;

  const {
    animatedPathProps,
    animatedBeaconProps,
    animatedBackdropStyle,
    beaconColor,
  } = useOverlayAnimation({
    measurement,
    currentStep,
    status,
    canvasWidth,
    canvasHeight,
    maskPadding,
    maskBorderRadius,
    theme,
  });

  const maskPointerEvents = resolvePointerEvents(currentStep.interactionMode);

  return (
    <Animated.View
      style={animatedBackdropStyle}
      pointerEvents={maskPointerEvents}
    >
      <Svg
        width={canvasWidth}
        height={canvasHeight}
        viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
        fillRule="evenodd"
      >
        <AnimatedPath
          animatedProps={animatedPathProps}
          fill={overlayColor}
          fillOpacity={overlayOpacity}
        />
        <AnimatedCircle
          animatedProps={animatedBeaconProps}
          fill="none"
          stroke={beaconColor}
          strokeWidth={BEACON_STROKE_WIDTH}
        />
      </Svg>
    </Animated.View>
  );
}
