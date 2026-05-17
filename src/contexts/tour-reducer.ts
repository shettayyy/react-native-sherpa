import type { TourState, TourAction } from '@sherpa/types';

export const INITIAL_STATE: TourState = {
  status: 'idle',
  activeTourId: null,
  currentStepIndex: 0,
  totalSteps: 0,
  queue: [],
};

const STARTABLE_STATUSES = new Set(['idle', 'completed', 'dismissed']);

function handleStartTour(state: TourState, tourId: string): TourState {
  if (!STARTABLE_STATUSES.has(state.status)) return state;
  return {
    ...state,
    status: 'running',
    activeTourId: tourId,
    currentStepIndex: 0,
    totalSteps: 0,
    queue: state.queue.filter((id) => id !== tourId),
  };
}

function handleNextStep(state: TourState): TourState {
  if (state.status !== 'running') return state;
  if (state.currentStepIndex >= state.totalSteps - 1) {
    return { ...state, status: 'completed' };
  }
  return { ...state, currentStepIndex: state.currentStepIndex + 1 };
}

function handlePrevStep(state: TourState): TourState {
  if (state.status !== 'running' || state.currentStepIndex === 0) return state;
  return { ...state, currentStepIndex: state.currentStepIndex - 1 };
}

function handleGoToStep(
  state: TourState,
  indexOrName: number | string
): TourState {
  if (state.status !== 'running' || typeof indexOrName !== 'number')
    return state;
  const clamped = Math.max(0, Math.min(indexOrName, state.totalSteps - 1));
  return { ...state, currentStepIndex: clamped };
}

function handleDismissTour(state: TourState): TourState {
  if (state.status !== 'running' && state.status !== 'paused') return state;
  return { ...state, status: 'dismissed' };
}

function handleResetTour(state: TourState, tourId?: string): TourState {
  if (tourId !== undefined && tourId !== state.activeTourId) return state;
  return { ...INITIAL_STATE, queue: state.queue };
}

function handleEnqueueTour(state: TourState, tourId: string): TourState {
  if (state.queue.includes(tourId)) return state;
  return { ...state, queue: [...state.queue, tourId] };
}

export function tourReducer(state: TourState, action: TourAction): TourState {
  switch (action.type) {
    case 'START_TOUR': {
      return handleStartTour(state, action.tourId);
    }
    case 'SET_TOTAL_STEPS': {
      return state.status === 'running'
        ? { ...state, totalSteps: action.totalSteps }
        : state;
    }
    case 'NEXT_STEP': {
      return handleNextStep(state);
    }
    case 'PREV_STEP': {
      return handlePrevStep(state);
    }
    case 'GO_TO_STEP': {
      return handleGoToStep(state, action.indexOrName);
    }
    case 'PAUSE_TOUR': {
      return state.status === 'running'
        ? { ...state, status: 'paused' }
        : state;
    }
    case 'RESUME_TOUR': {
      return state.status === 'paused'
        ? { ...state, status: 'running' }
        : state;
    }
    case 'COMPLETE_TOUR': {
      return state.status === 'running'
        ? { ...state, status: 'completed' }
        : state;
    }
    case 'DISMISS_TOUR': {
      return handleDismissTour(state);
    }
    case 'RESET_TOUR': {
      return handleResetTour(state, action.tourId);
    }
    case 'ENQUEUE_TOUR': {
      return handleEnqueueTour(state, action.tourId);
    }
    default: {
      return state;
    }
  }
}
