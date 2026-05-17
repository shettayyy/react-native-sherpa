import type { RegisteredTourId, RegisteredStepName } from './registry';

export type TourStartEvent = {
  tourId: RegisteredTourId;
  totalSteps: number;
};

export type TourCompleteEvent = {
  tourId: RegisteredTourId;
  totalSteps: number;
};

export type TourSkipEvent = {
  tourId: RegisteredTourId;
  stepIndex: number;
};

export type TourDismissEvent = {
  tourId: RegisteredTourId;
  stepIndex: number;
};

export type StepEnterEvent = {
  tourId: RegisteredTourId;
  stepName: RegisteredStepName<RegisteredTourId>;
  stepIndex: number;
};

export type StepExitEvent = {
  tourId: RegisteredTourId;
  stepName: RegisteredStepName<RegisteredTourId>;
  stepIndex: number;
};

export type StepSkipEvent = {
  tourId: RegisteredTourId;
  stepName: RegisteredStepName<RegisteredTourId>;
  stepIndex: number;
};

export type StepActionEvent = {
  tourId: RegisteredTourId;
  stepName: RegisteredStepName<RegisteredTourId>;
  stepIndex: number;
  action: string;
};
