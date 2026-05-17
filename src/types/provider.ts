import type React from 'react';

import type {
  TourStartEvent,
  TourCompleteEvent,
  TourSkipEvent,
  TourDismissEvent,
  StepEnterEvent,
  StepExitEvent,
  StepSkipEvent,
  StepActionEvent,
} from './events';
import type { ElementMeasurement, TourStatus, TooltipPlacement } from './tour';
import type { RegisteredTourId, RegisteredStepName } from './registry';
import type { StepRegistration } from './step';
import type { SherpaTheme } from './theme';

export type OverlayProps = {
  measurement: ElementMeasurement;
  currentStep: StepRegistration;
  status: TourStatus;
};

export type OverlayComponent = React.ComponentType<OverlayProps>;

export type TooltipProps = {
  measurement: ElementMeasurement;
  currentStep: StepRegistration;
  placement: TooltipPlacement;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onDismiss: () => void;
};

export type TooltipComponent = React.ComponentType<TooltipProps>;

export type TourProviderProps = {
  children: React.ReactNode;
  onTourStart?: (event: TourStartEvent) => void;
  onTourComplete?: (event: TourCompleteEvent) => void;
  onTourSkip?: (event: TourSkipEvent) => void;
  onTourDismiss?: (event: TourDismissEvent) => void;
  onStepEnter?: (event: StepEnterEvent) => void;
  onStepExit?: (event: StepExitEvent) => void;
  onStepSkip?: (event: StepSkipEvent) => void;
  onStepAction?: (event: StepActionEvent) => void;
  theme?: Partial<SherpaTheme>;
  overlay?: OverlayComponent;
  tooltip?: TooltipComponent;
};

export type TourProviderHandle = {
  start: (tourId: RegisteredTourId) => void;
  next: () => void;
  prev: () => void;
  goTo: (
    stepIndexOrName: number | RegisteredStepName<RegisteredTourId>
  ) => void;
  pause: () => void;
  resume: () => void;
  dismiss: () => void;
  reset: (tourId?: RegisteredTourId) => void;
  enqueue: (tourId: RegisteredTourId) => void;
};
