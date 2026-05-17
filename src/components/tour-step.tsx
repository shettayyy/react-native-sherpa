import { View } from 'react-native';

import type { TourStepProps } from '@sherpa/types';
import { useTourStep } from '@sherpa/hooks';

export function TourStep({
  tourId,
  name,
  order,
  interactionMode,
  maskShape,
  maskPadding,
  maskBorderRadius,
  customMaskPath,
  tooltipPlacement,
  content,
  metadata,
  children,
}: Readonly<TourStepProps>) {
  const { ref } = useTourStep({
    tourId,
    name,
    order,
    interactionMode,
    maskShape,
    maskPadding,
    maskBorderRadius,
    customMaskPath,
    tooltipPlacement,
    content,
    metadata,
  });

  return (
    <View ref={ref} collapsable={false} pointerEvents="box-none">
      {children}
    </View>
  );
}
