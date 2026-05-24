import {
  useReducer,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  type Ref,
} from 'react';
import { checkReanimatedSetup, mergeTheme } from '@sherpa/utilities';

import type {
  TourProviderProps,
  TourProviderHandle,
  ElementMeasurement,
  StepRegistration,
} from '@sherpa/types';
import { Overlay } from '@sherpa/components';
import { TourStateContext } from './tour-state-context';
import { TourDispatchContext } from './tour-dispatch-context';
import {
  StepRegistryContext,
  type StepRegistry,
} from './step-registry-context';
import {
  ScrollAdapterContext,
  type ScrollAdapterRegistry,
} from './scroll-adapter-context';
import { tourReducer, INITIAL_STATE } from './tour-reducer';

type TourProviderComponentProps = Readonly<TourProviderProps> & {
  ref?: Ref<TourProviderHandle>;
};

export function TourProvider({
  children,
  ref,
  overlay,
  tooltip,
  theme,
}: TourProviderComponentProps) {
  const resolvedTheme = mergeTheme(theme);
  useEffect(() => {
    checkReanimatedSetup();
  }, []);

  const [state, dispatch] = useReducer(tourReducer, INITIAL_STATE);
  const registryRef = useRef<StepRegistry>(new Map());
  const scrollAdapterRegistryRef = useRef<ScrollAdapterRegistry>(new Map());
  const [activeMeasurement, setActiveMeasurement] =
    useState<ElementMeasurement | null>(null);
  const [activeStep, setActiveStep] = useState<StepRegistration | null>(null);

  useEffect(() => {
    if (state.status === 'completed' || state.status === 'dismissed') {
      setActiveMeasurement(null);
      setActiveStep(null);
      const nextTourId = state.queue[0];
      if (nextTourId !== undefined) {
        dispatch({ type: 'START_TOUR', tourId: nextTourId });
      }
    }
  }, [state.status, state.queue]);

  useEffect(() => {
    if (
      (state.status !== 'running' && state.status !== 'transitioning') ||
      state.activeTourId === null
    ) {
      return;
    }

    const registry = registryRef.current;
    const tourSteps = [...registry.values()]
      .filter((s) => s.tourId === state.activeTourId)
      .sort((a, b) => a.order - b.order);

    if (tourSteps.length !== state.totalSteps) {
      dispatch({ type: 'SET_TOTAL_STEPS', totalSteps: tourSteps.length });
    }

    if (
      typeof state.currentStepIndex !== 'number' ||
      state.currentStepIndex < 0 ||
      state.currentStepIndex >= tourSteps.length
    ) {
      return;
    }

    const step = tourSteps[state.currentStepIndex];
    if (step === undefined) {
      return;
    }

    let cancelled = false;
    const isResuming = state.status === 'transitioning';

    const measure = async () => {
      const adapter = scrollAdapterRegistryRef.current.get(
        state.activeTourId ?? ''
      );
      if (adapter) {
        await adapter(step.name, step.viewRef);
      }
      const measurement = await step.measureFn();
      if (!cancelled) {
        setActiveStep(step);
        setActiveMeasurement(measurement);

        if (isResuming) {
          dispatch({ type: 'FINISH_TRANSITION' });
        }
      }
    };

    measure().catch((error) => {
      if (__DEV__) console.warn('[sherpa] measure failed:', error);
    });

    return () => {
      cancelled = true;
    };
  }, [
    state.status,
    state.activeTourId,
    state.currentStepIndex,
    state.totalSteps,
  ]);

  useImperativeHandle(
    ref,
    () => ({
      start: (tourId) => dispatch({ type: 'START_TOUR', tourId }),
      next: () => dispatch({ type: 'NEXT_STEP' }),
      prev: () => dispatch({ type: 'PREV_STEP' }),
      goTo: (stepIndexOrName) => {
        if (typeof stepIndexOrName === 'number') {
          dispatch({ type: 'GO_TO_STEP', index: stepIndexOrName });
          return;
        }
        const steps = [...registryRef.current.values()]
          .filter((s) => s.tourId === state.activeTourId)
          .sort((a, b) => a.order - b.order);
        const index = steps.findIndex((s) => s.name === stepIndexOrName);
        if (index !== -1) {
          dispatch({ type: 'GO_TO_STEP', index });
        } else if (__DEV__) {
          console.warn(
            `[Sherpa] goTo: step "${String(stepIndexOrName)}" not found in tour "${state.activeTourId}".`
          );
        }
      },
      pause: () => dispatch({ type: 'PAUSE_TOUR' }),
      resume: () => dispatch({ type: 'RESUME_TOUR' }),
      dismiss: () => dispatch({ type: 'DISMISS_TOUR' }),
      reset: (tourId) => dispatch({ type: 'RESET_TOUR', tourId }),
      enqueue: (tourId) => dispatch({ type: 'ENQUEUE_TOUR', tourId }),
    }),
    [state.activeTourId]
  );

  return (
    <TourStateContext value={state}>
      <TourDispatchContext value={dispatch}>
        <StepRegistryContext value={registryRef}>
          <ScrollAdapterContext value={scrollAdapterRegistryRef}>
            {children}
            {activeMeasurement !== null && activeStep !== null && (
              <Overlay
                measurement={activeMeasurement}
                currentStep={activeStep}
                status={state.status}
                stepIndex={state.currentStepIndex}
                totalSteps={state.totalSteps}
                OverlayComponent={overlay}
                TooltipComponent={tooltip}
                theme={resolvedTheme}
              />
            )}
          </ScrollAdapterContext>
        </StepRegistryContext>
      </TourDispatchContext>
    </TourStateContext>
  );
}
