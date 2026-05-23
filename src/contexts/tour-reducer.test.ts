import { describe, expect, it } from '@jest/globals';

import { tourReducer, INITIAL_STATE } from './tour-reducer';
import type { TourState } from '@sherpa/types';

const TOUR_A = 'tour-a';
const TOUR_B = 'tour-b';

const STATUS_RUNNING = 'running' as const;
const STATUS_PAUSED = 'paused' as const;
const STATUS_TRANSITIONING = 'transitioning' as const;
const STATUS_COMPLETED = 'completed' as const;
const STATUS_DISMISSED = 'dismissed' as const;

const IGNORES_WHEN_NOT_RUNNING = 'ignores when not running';

const runningState: TourState = {
  status: STATUS_RUNNING,
  activeTourId: TOUR_A,
  currentStepIndex: 0,
  totalSteps: 3,
  queue: [],
};

describe('tourReducer', () => {
  describe('START_TOUR', () => {
    it('starts from idle', () => {
      const next = tourReducer(INITIAL_STATE, {
        type: 'START_TOUR',
        tourId: TOUR_A,
      });
      expect(next.status).toBe(STATUS_RUNNING);
      expect(next.activeTourId).toBe(TOUR_A);
      expect(next.currentStepIndex).toBe(0);
    });

    it('starts from completed', () => {
      const state: TourState = { ...INITIAL_STATE, status: STATUS_COMPLETED };
      const next = tourReducer(state, { type: 'START_TOUR', tourId: TOUR_B });
      expect(next.status).toBe(STATUS_RUNNING);
    });

    it('starts from dismissed', () => {
      const state: TourState = { ...INITIAL_STATE, status: STATUS_DISMISSED };
      const next = tourReducer(state, { type: 'START_TOUR', tourId: TOUR_B });
      expect(next.status).toBe(STATUS_RUNNING);
    });

    it('ignores when already running', () => {
      const next = tourReducer(runningState, {
        type: 'START_TOUR',
        tourId: TOUR_B,
      });
      expect(next).toBe(runningState);
    });

    it('ignores when paused', () => {
      const state: TourState = { ...runningState, status: STATUS_PAUSED };
      const next = tourReducer(state, { type: 'START_TOUR', tourId: TOUR_B });
      expect(next).toBe(state);
    });

    it('removes started tour from queue', () => {
      const state: TourState = {
        ...INITIAL_STATE,
        queue: [TOUR_A, TOUR_B],
      };
      const next = tourReducer(state, { type: 'START_TOUR', tourId: TOUR_A });
      expect(next.queue).toEqual([TOUR_B]);
    });
  });

  describe('NEXT_STEP', () => {
    it('increments step index', () => {
      const next = tourReducer(runningState, { type: 'NEXT_STEP' });
      expect(next.currentStepIndex).toBe(1);
      expect(next.status).toBe(STATUS_RUNNING);
    });

    it('completes the tour on last step', () => {
      const state: TourState = { ...runningState, currentStepIndex: 2 };
      const next = tourReducer(state, { type: 'NEXT_STEP' });
      expect(next.status).toBe(STATUS_COMPLETED);
    });

    it(IGNORES_WHEN_NOT_RUNNING, () => {
      const state: TourState = { ...runningState, status: STATUS_PAUSED };
      const next = tourReducer(state, { type: 'NEXT_STEP' });
      expect(next).toBe(state);
    });
  });

  describe('PREV_STEP', () => {
    it('decrements step index', () => {
      const state: TourState = { ...runningState, currentStepIndex: 2 };
      const next = tourReducer(state, { type: 'PREV_STEP' });
      expect(next.currentStepIndex).toBe(1);
    });

    it('is a no-op on first step', () => {
      const next = tourReducer(runningState, { type: 'PREV_STEP' });
      expect(next).toBe(runningState);
    });

    it(IGNORES_WHEN_NOT_RUNNING, () => {
      const state: TourState = { ...runningState, status: STATUS_PAUSED };
      const next = tourReducer(state, { type: 'PREV_STEP' });
      expect(next).toBe(state);
    });
  });

  describe('GO_TO_STEP', () => {
    it('jumps to a valid index', () => {
      const next = tourReducer(runningState, { type: 'GO_TO_STEP', index: 2 });
      expect(next.currentStepIndex).toBe(2);
    });

    it('clamps to last step when index exceeds bounds', () => {
      const next = tourReducer(runningState, { type: 'GO_TO_STEP', index: 99 });
      expect(next.currentStepIndex).toBe(2);
    });

    it('clamps to 0 when index is negative', () => {
      const next = tourReducer(runningState, { type: 'GO_TO_STEP', index: -5 });
      expect(next.currentStepIndex).toBe(0);
    });

    it(IGNORES_WHEN_NOT_RUNNING, () => {
      const state: TourState = { ...runningState, status: STATUS_PAUSED };
      const next = tourReducer(state, { type: 'GO_TO_STEP', index: 1 });
      expect(next).toBe(state);
    });
  });

  describe('PAUSE_TOUR', () => {
    it('pauses when running', () => {
      const next = tourReducer(runningState, { type: 'PAUSE_TOUR' });
      expect(next.status).toBe(STATUS_PAUSED);
    });

    it(IGNORES_WHEN_NOT_RUNNING, () => {
      const state: TourState = { ...runningState, status: STATUS_PAUSED };
      const next = tourReducer(state, { type: 'PAUSE_TOUR' });
      expect(next).toBe(state);
    });
  });

  describe('RESUME_TOUR', () => {
    it('transitions to transitioning when paused', () => {
      const state: TourState = { ...runningState, status: STATUS_PAUSED };
      const next = tourReducer(state, { type: 'RESUME_TOUR' });
      expect(next.status).toBe(STATUS_TRANSITIONING);
    });

    it('ignores when not paused', () => {
      const next = tourReducer(runningState, { type: 'RESUME_TOUR' });
      expect(next).toBe(runningState);
    });
  });

  describe('FINISH_TRANSITION', () => {
    it('moves to running when transitioning', () => {
      const state: TourState = {
        ...runningState,
        status: STATUS_TRANSITIONING,
      };
      const next = tourReducer(state, { type: 'FINISH_TRANSITION' });
      expect(next.status).toBe(STATUS_RUNNING);
    });

    it('ignores when not transitioning', () => {
      const next = tourReducer(runningState, { type: 'FINISH_TRANSITION' });
      expect(next).toBe(runningState);
    });
  });

  describe('COMPLETE_TOUR', () => {
    it('completes when running', () => {
      const next = tourReducer(runningState, { type: 'COMPLETE_TOUR' });
      expect(next.status).toBe(STATUS_COMPLETED);
    });

    it(IGNORES_WHEN_NOT_RUNNING, () => {
      const state: TourState = { ...runningState, status: STATUS_PAUSED };
      const next = tourReducer(state, { type: 'COMPLETE_TOUR' });
      expect(next).toBe(state);
    });
  });

  describe('DISMISS_TOUR', () => {
    it('dismisses when running', () => {
      const next = tourReducer(runningState, { type: 'DISMISS_TOUR' });
      expect(next.status).toBe(STATUS_DISMISSED);
    });

    it('dismisses when paused', () => {
      const state: TourState = { ...runningState, status: STATUS_PAUSED };
      const next = tourReducer(state, { type: 'DISMISS_TOUR' });
      expect(next.status).toBe(STATUS_DISMISSED);
    });

    it('ignores when idle', () => {
      const next = tourReducer(INITIAL_STATE, { type: 'DISMISS_TOUR' });
      expect(next).toBe(INITIAL_STATE);
    });
  });

  describe('RESET_TOUR', () => {
    it('resets to initial state', () => {
      const next = tourReducer(runningState, { type: 'RESET_TOUR' });
      expect(next.status).toBe('idle');
      expect(next.activeTourId).toBeNull();
      expect(next.currentStepIndex).toBe(0);
    });

    it('preserves the queue on reset', () => {
      const state: TourState = { ...runningState, queue: [TOUR_B] };
      const next = tourReducer(state, { type: 'RESET_TOUR' });
      expect(next.queue).toEqual([TOUR_B]);
    });

    it('resets when tourId matches active tour', () => {
      const next = tourReducer(runningState, {
        type: 'RESET_TOUR',
        tourId: TOUR_A,
      });
      expect(next.status).toBe('idle');
    });

    it('ignores when tourId does not match active tour', () => {
      const next = tourReducer(runningState, {
        type: 'RESET_TOUR',
        tourId: 'tour-z',
      });
      expect(next).toBe(runningState);
    });
  });

  describe('ENQUEUE_TOUR', () => {
    it('adds a tour to the queue', () => {
      const next = tourReducer(runningState, {
        type: 'ENQUEUE_TOUR',
        tourId: TOUR_B,
      });
      expect(next.queue).toEqual([TOUR_B]);
    });

    it('does not add duplicates', () => {
      const state: TourState = { ...runningState, queue: [TOUR_B] };
      const next = tourReducer(state, {
        type: 'ENQUEUE_TOUR',
        tourId: TOUR_B,
      });
      expect(next).toBe(state);
    });
  });
});
