import type { ElementMeasurement, TooltipPlacement } from '@sherpa/types';

export type CanvasSize = {
  width: number;
  height: number;
};

/** Minimum px above/below required to honour top/bottom placement. */
const MIN_SPACE_VERTICAL = 160;
/** Minimum px left/right required to honour left/right placement. */
const MIN_SPACE_HORIZONTAL = 292; // TOOLTIP_MAX_WIDTH (280) + TOOLTIP_GAP (12)

const OPPOSITE: Record<TooltipPlacement, TooltipPlacement> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

function availableSpace(
  placement: TooltipPlacement,
  measurement: ElementMeasurement,
  canvas: CanvasSize
): number {
  const { pageX, pageY, width, height } = measurement;
  if (placement === 'top') return pageY;
  if (placement === 'bottom') return canvas.height - (pageY + height);
  if (placement === 'left') return pageX;
  return canvas.width - (pageX + width);
}

export function resolveTooltipPlacement(
  measurement: ElementMeasurement,
  canvas: CanvasSize,
  preferred?: TooltipPlacement
): TooltipPlacement {
  const { pageX, pageY, width, height } = measurement;

  const spaceAbove = pageY;
  const spaceBelow = canvas.height - (pageY + height);
  const spaceLeft = pageX;
  const spaceRight = canvas.width - (pageX + width);

  const spaces: [TooltipPlacement, number][] = [
    ['bottom', spaceBelow],
    ['top', spaceAbove],
    ['right', spaceRight],
    ['left', spaceLeft],
  ];

  if (preferred !== undefined) {
    const isHorizontal = preferred === 'left' || preferred === 'right';
    const threshold = isHorizontal ? MIN_SPACE_HORIZONTAL : MIN_SPACE_VERTICAL;
    const opposite = OPPOSITE[preferred];
    const oppositeThreshold =
      opposite === 'left' || opposite === 'right'
        ? MIN_SPACE_HORIZONTAL
        : MIN_SPACE_VERTICAL;

    if (availableSpace(preferred, measurement, canvas) >= threshold) {
      return preferred;
    }
    if (availableSpace(opposite, measurement, canvas) >= oppositeThreshold) {
      return opposite;
    }
  }

  // Find the side with the most available space. Default order acts as
  // tiebreaker: bottom > top > right > left.
  let best: TooltipPlacement = 'bottom';
  let bestSpace = -1;

  for (const [placement, space] of spaces) {
    if (space > bestSpace) {
      bestSpace = space;
      best = placement;
    }
  }

  return best;
}
