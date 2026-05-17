import { createContext, type RefObject } from 'react';

import type { StepRegistration } from '@sherpa/types';

export type StepRegistry = Map<string, StepRegistration>;

export const StepRegistryContext = createContext<RefObject<StepRegistry>>({
  current: new Map(),
});
