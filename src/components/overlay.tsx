import { StyleSheet, useWindowDimensions, View } from 'react-native';

import type {
  OverlayProps,
  OverlayComponent,
  TooltipComponent,
  SherpaTheme,
} from '@sherpa/types';
import { useTourActions } from '@sherpa/hooks';
import { AnimatedMask } from './animated-mask';
import { Tooltip } from './tooltip';

type DefaultOverlayProps = OverlayProps & {
  stepIndex: number;
  totalSteps: number;
  TooltipComponent?: TooltipComponent;
  theme: SherpaTheme;
};

function DefaultOverlay({
  measurement,
  currentStep,
  status,
  stepIndex,
  totalSteps,
  TooltipComponent: CustomTooltip,
  theme,
}: Readonly<DefaultOverlayProps>) {
  const { width: canvasWidth, height: canvasHeight } = useWindowDimensions();
  const { next, prev, dismiss } = useTourActions();

  const overlayColor = theme.overlay.color;
  const overlayOpacity = theme.overlay.opacity;

  const tooltipProps = {
    measurement,
    currentStep,
    placement: 'bottom' as const,
    stepIndex,
    totalSteps,
    onNext: next,
    onPrev: prev,
    onDismiss: dismiss,
    theme,
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <AnimatedMask
        measurement={measurement}
        currentStep={currentStep}
        status={status}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        overlayColor={overlayColor}
        overlayOpacity={overlayOpacity}
        theme={theme}
      />
      {CustomTooltip === undefined ? (
        <Tooltip {...tooltipProps} />
      ) : (
        <CustomTooltip {...tooltipProps} />
      )}
    </View>
  );
}

type OverlayContainerProps = OverlayProps & {
  stepIndex: number;
  totalSteps: number;
  OverlayComponent?: OverlayComponent;
  TooltipComponent?: TooltipComponent;
  theme: SherpaTheme;
};

export function Overlay({
  measurement,
  currentStep,
  status,
  stepIndex,
  totalSteps,
  OverlayComponent: CustomOverlay,
  TooltipComponent: CustomTooltip,
  theme,
}: Readonly<OverlayContainerProps>) {
  if (status !== 'running' && status !== 'transitioning') {
    return null;
  }

  if (CustomOverlay !== undefined) {
    if (__DEV__ && CustomTooltip !== undefined) {
      console.warn(
        '[Sherpa] TooltipComponent is ignored when a custom OverlayComponent is provided.'
      );
    }
    return (
      <CustomOverlay
        measurement={measurement}
        currentStep={currentStep}
        status={status}
      />
    );
  }

  return (
    <DefaultOverlay
      measurement={measurement}
      currentStep={currentStep}
      status={status}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      TooltipComponent={CustomTooltip}
      theme={theme}
    />
  );
}
