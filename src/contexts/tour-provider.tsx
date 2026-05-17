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
    if (state.status !== 'running' || state.activeTourId === null) {
      return;
    }

    const registry = registryRef.current;
    const tourSteps = [...registry.values()]
      .filter((s) => s.tourId === state.activeTourId)
      .sort((a, b) => a.order - b.order);

    if (tourSteps.length !== state.totalSteps) {
      dispatch({ type: 'SET_TOTAL_STEPS', totalSteps: tourSteps.length });
    }

    const step = tourSteps[state.currentStepIndex];
    if (step === undefined) {
      return;
    }

    let cancelled = false;

    const measure = async () => {
      const measurement = await step.measureFn();
      if (!cancelled) {
        setActiveStep(step);
        setActiveMeasurement(measurement);
      }
    };

    measure().catch(() => {});

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
      goTo: (stepIndexOrName) =>
        dispatch({ type: 'GO_TO_STEP', indexOrName: stepIndexOrName }),
      pause: () => dispatch({ type: 'PAUSE_TOUR' }),
      resume: () => dispatch({ type: 'RESUME_TOUR' }),
      dismiss: () => dispatch({ type: 'DISMISS_TOUR' }),
      reset: (tourId) => dispatch({ type: 'RESET_TOUR', tourId }),
      enqueue: (tourId) => dispatch({ type: 'ENQUEUE_TOUR', tourId }),
    }),
    []
  );

  return (
    <TourStateContext value={state}>
      <TourDispatchContext value={dispatch}>
        <StepRegistryContext value={registryRef}>
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
        </StepRegistryContext>
      </TourDispatchContext>
    </TourStateContext>
  );
}
