import type { ImageSourcePropType, TextStyle } from 'react-native';

import type {
  InteractionMode,
  ElementMeasurement,
  TooltipPlacement,
} from './tour';
import type { RegisteredTourId, RegisteredStepName } from './registry';

export type MaskShape = 'rect' | 'rounded-rect' | 'circle';

export type MaskPathFn = (params: {
  position: { x: number; y: number };
  size: { width: number; height: number };
  canvasSize: { width: number; height: number };
  step: StepRegistration;
}) => string;

/**
 * Content for the `text` variant of a tour step tooltip.
 *
 * `title` and `body` each accept either a plain string or a React node:
 * - **string** — rendered inside a themed `<Text>` wrapper. Pass `titleStyle`
 *   or `bodyStyle` to override individual style properties while keeping the
 *   default theme styles as a base.
 * - **React.ReactNode** — rendered with no wrapper at all. You are fully
 *   responsible for layout and styling; `titleStyle` / `bodyStyle` are not
 *   applicable and therefore not accepted when a node is supplied.
 *
 * Pass `titleStyle` or `bodyStyle` to override individual styles while keeping
 * the default theme as a base. Pass a `React.ReactNode` for either field to
 * skip the wrapper entirely and take full control of rendering.
 */
type TextStepContentBase = { type: 'text' };

export type TextStepContent =
  | (TextStepContentBase & {
      title: string;
      titleStyle?: TextStyle;
      body: string;
      bodyStyle?: TextStyle;
    })
  | (TextStepContentBase & {
      title: React.ReactNode;
      body: string;
      bodyStyle?: TextStyle;
    })
  | (TextStepContentBase & {
      title: string;
      titleStyle?: TextStyle;
      body: React.ReactNode;
    })
  | (TextStepContentBase & {
      title: React.ReactNode;
      body: React.ReactNode;
    });

export type StepContent =
  | TextStepContent
  | { type: 'component'; render: () => React.ReactNode }
  | { type: 'image'; source: ImageSourcePropType; title?: string }
  | { type: 'lottie'; source: unknown; title?: string };

export type StepRegistration = {
  name: string;
  tourId: string;
  order: number;
  measureFn: () => Promise<ElementMeasurement>;
  interactionMode: InteractionMode;
  maskShape?: MaskShape;
  maskPadding?: number;
  maskBorderRadius?: number;
  customMaskPath?: MaskPathFn;
  /** @see TourStepProps.tooltipPlacement */
  tooltipPlacement?: TooltipPlacement;
  content?: StepContent;
  metadata?: Record<string, unknown>;
};

export type TourStepProps = {
  tourId: RegisteredTourId;
  name: RegisteredStepName<RegisteredTourId>;
  order: number;
  interactionMode?: InteractionMode;
  maskShape?: MaskShape;
  maskPadding?: number;
  maskBorderRadius?: number;
  customMaskPath?: MaskPathFn;
  /**
   * Preferred side for the tooltip relative to the highlighted element.
   * If there is not enough space on the requested side, the library falls back
   * to the opposite side, then to whichever side has the most room.
   */
  tooltipPlacement?: TooltipPlacement;
  content?: StepContent;
  metadata?: Record<string, unknown>;
  children: React.ReactNode;
};
