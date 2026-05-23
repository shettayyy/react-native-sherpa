import { useContext, useCallback } from 'react';

import type { RegisteredTourId, RegisteredStepName } from '@sherpa/types';
import { TourDispatchContext } from '../contexts/tour-dispatch-context';
import { StepRegistryContext } from '../contexts/step-registry-context';
import { TourStateContext } from '../contexts/tour-state-context';

export function useTourActions() {
  const dispatch = useContext(TourDispatchContext);
  const registryRef = useContext(StepRegistryContext);
  const { activeTourId } = useContext(TourStateContext);

  const start = useCallback(
    (tourId: RegisteredTourId) => {
      dispatch({ type: 'START_TOUR', tourId });
    },
    [dispatch]
  );

  const next = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' });
  }, [dispatch]);

  const prev = useCallback(() => {
    dispatch({ type: 'PREV_STEP' });
  }, [dispatch]);

  const goTo = useCallback(
    (stepIndexOrName: number | RegisteredStepName<RegisteredTourId>) => {
      if (typeof stepIndexOrName === 'number') {
        dispatch({ type: 'GO_TO_STEP', index: stepIndexOrName });
        return;
      }
      const steps = [...registryRef.current.values()]
        .filter((s) => s.tourId === activeTourId)
        .sort((a, b) => a.order - b.order);
      const index = steps.findIndex((s) => s.name === stepIndexOrName);
      if (index !== -1) {
        dispatch({ type: 'GO_TO_STEP', index });
      } else if (__DEV__) {
        console.warn(
          `[Sherpa] goTo: step "${String(stepIndexOrName)}" not found in tour "${activeTourId}".`
        );
      }
    },
    [dispatch, registryRef, activeTourId]
  );

  const pause = useCallback(() => {
    dispatch({ type: 'PAUSE_TOUR' });
  }, [dispatch]);

  const resume = useCallback(() => {
    dispatch({ type: 'RESUME_TOUR' });
  }, [dispatch]);

  const complete = useCallback(() => {
    dispatch({ type: 'COMPLETE_TOUR' });
  }, [dispatch]);

  const dismiss = useCallback(() => {
    dispatch({ type: 'DISMISS_TOUR' });
  }, [dispatch]);

  const reset = useCallback(
    (tourId?: RegisteredTourId) => {
      dispatch({ type: 'RESET_TOUR', tourId });
    },
    [dispatch]
  );

  const enqueue = useCallback(
    (tourId: RegisteredTourId) => {
      dispatch({ type: 'ENQUEUE_TOUR', tourId });
    },
    [dispatch]
  );

  return {
    start,
    next,
    prev,
    goTo,
    pause,
    resume,
    complete,
    dismiss,
    reset,
    enqueue,
  };
}
