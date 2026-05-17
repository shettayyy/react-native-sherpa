import { useRef, useEffect, useContext, type ComponentRef } from 'react';
import { View } from 'react-native';

import type { TourStepProps } from '@sherpa/types';
import { StepRegistryContext } from '../contexts/step-registry-context';
import { measureInWindow } from '@sherpa/utilities';

type UseTourStepOptions = Pick<
  TourStepProps,
  | 'tourId'
  | 'name'
  | 'order'
  | 'interactionMode'
  | 'maskShape'
  | 'maskPadding'
  | 'maskBorderRadius'
  | 'customMaskPath'
  | 'tooltipPlacement'
  | 'content'
  | 'metadata'
>;

export function useTourStep({
  tourId,
  name,
  order,
  interactionMode = 'blocking',
  maskShape,
  maskPadding,
  maskBorderRadius,
  customMaskPath,
  tooltipPlacement,
  content,
  metadata,
}: UseTourStepOptions) {
  const ref = useRef<ComponentRef<typeof View>>(null);
  const registry = useContext(StepRegistryContext);
  const key = `${tourId}:${name}`;

  useEffect(() => {
    const currentRegistry = registry.current;

    currentRegistry.set(key, {
      name,
      tourId,
      order,
      interactionMode,
      maskShape,
      maskPadding,
      maskBorderRadius,
      customMaskPath,
      tooltipPlacement,
      content,
      metadata,
      measureFn: () => {
        const target = ref.current;
        if (__DEV__ && target === null) {
          console.warn(
            `[Sherpa] ref for step "${key}" is null at activation time. Make sure collapsable={false} is set on the target View.`
          );
        }
        return measureInWindow(target!);
      },
    });

    return () => {
      currentRegistry.delete(key);
    };
  }, [
    key,
    name,
    tourId,
    order,
    interactionMode,
    maskShape,
    maskPadding,
    maskBorderRadius,
    customMaskPath,
    tooltipPlacement,
    content,
    metadata,
    registry,
  ]);

  return { ref };
}
