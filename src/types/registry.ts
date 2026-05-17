export interface SherpaRegistry {
  tours: Record<string, { steps: string }>;
}

export type RegisteredTourId = keyof SherpaRegistry['tours'];

export type RegisteredStepName<T extends RegisteredTourId> =
  SherpaRegistry['tours'][T]['steps'];
