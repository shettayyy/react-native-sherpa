export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

/**
 * Represents the lifecycle state of a tour at any given moment.
 *
 * - `idle`: No tour is active. The app is waiting for a tour to start.
 *   ```
 *   // app just opened, no tour has started yet
 *   status === 'idle'
 *   ```
 *
 * - `running`: A tour is active and a tooltip is visible on screen.
 *   ```
 *   // user is on step 2 of 5, tooltip points at the "Save" button
 *   status === 'running'
 *   ```
 *
 * - `transitioning`: Moving between steps. Current tooltip has closed, next has not appeared.
 *   Brief in-between state for scroll, measurement, and animation.
 *   ```
 *   // user tapped "Next", screen is scrolling to bring the next target into view
 *   status === 'transitioning'
 *   ```
 *
 * - `paused`: Tour is active but overlay and tooltip are completely hidden. The user has full
 *   control of the app as if no tour were running. Triggered by a back gesture or an async
 *   condition. The overlay always hides on pause -- the back-gesture case makes this
 *   non-negotiable since the user is on a different screen. On resume, goes back through
 *   `transitioning` so the target element is re-measured before the overlay appears.
 *   ```
 *   // user swiped back mid-tour; overlay is gone, app is fully interactive
 *   status === 'paused'
 *   ```
 *
 * - `completed`: The user finished all steps. The tour ended naturally.
 *   ```
 *   // user tapped "Done" on the final step
 *   status === 'completed'
 *   ```
 *
 * - `dismissed`: The user chose to exit before finishing.
 *   ```
 *   // user tapped "Skip" on step 3 of 7
 *   status === 'dismissed'
 *   ```
 */
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
  | { type: 'FINISH_TRANSITION' }
  | { type: 'COMPLETE_TOUR' }
  | { type: 'DISMISS_TOUR' }
  | { type: 'RESET_TOUR'; tourId?: string }
  | { type: 'ENQUEUE_TOUR'; tourId: string };
