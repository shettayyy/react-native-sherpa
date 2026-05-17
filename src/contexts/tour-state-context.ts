import { createContext } from 'react';

import type { TourState } from '@sherpa/types';
import { INITIAL_STATE } from './tour-reducer';

export const TourStateContext = createContext<TourState>(INITIAL_STATE);
