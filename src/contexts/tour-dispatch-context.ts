import { createContext } from 'react';

import type { TourAction } from '@sherpa/types';

export const TourDispatchContext = createContext<React.Dispatch<TourAction>>(
  () => {}
);
