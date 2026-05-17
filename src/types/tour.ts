export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export type TourStatus =
  | 'idle'
  | 'running'
  | 'transitioning'
  | 'paused'
  | 'completed'
  | 'dismissed';

export type InteractionMode = 'blocking' | 'passthrough' | 'observe' | 'free';

export type ElementMeasurement = {
  pageX: number;
  pageY: number;
  width: number;
  height: number;
};

export type TourState = {
  status: TourStatus;
  activeTourId: string | null;
  currentStepIndex: number;
  totalSteps: number;
  queue: string[];
};

export type TourAction =
  | { type: 'START_TOUR'; tourId: string }
  | { type: 'SET_TOTAL_STEPS'; totalSteps: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; indexOrName: number | string }
  | { type: 'PAUSE_TOUR' }
  | { type: 'RESUME_TOUR' }
  | { type: 'COMPLETE_TOUR' }
  | { type: 'DISMISS_TOUR' }
  | { type: 'RESET_TOUR'; tourId?: string }
  | { type: 'ENQUEUE_TOUR'; tourId: string };
