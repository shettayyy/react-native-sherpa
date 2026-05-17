import { useContext } from 'react';

import type { TourState } from '@sherpa/types';
import { TourStateContext } from '../contexts/tour-state-context';

export function useTourState(): TourState {
  return useContext(TourStateContext);
}
