'worklet';

import type { MaskShape, MaskPathFn, StepRegistration } from '@sherpa/types';

export type BuildSvgPathParams = {
  pageX: number;
  pageY: number;
  width: number;
  height: number;
  canvasWidth: number;
  canvasHeight: number;
  maskShape: MaskShape;
  maskPadding: number;
  maskBorderRadius: number;
};

function buildRectPath(x: number, y: number, w: number, h: number): string {
  'worklet';
  return `M${x},${y} H${x + w} V${y + h} H${x} Z`;
}

function buildRoundedRectPath(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): string {
  'worklet';
  const cr = Math.min(r, w / 2, h / 2);
  return (
    `M${x + cr},${y}` +
    ` H${x + w - cr}` +
    ` Q${x + w},${y} ${x + w},${y + cr}` +
    ` V${y + h - cr}` +
    ` Q${x + w},${y + h} ${x + w - cr},${y + h}` +
    ` H${x + cr}` +
    ` Q${x},${y + h} ${x},${y + h - cr}` +
    ` V${y + cr}` +
    ` Q${x},${y} ${x + cr},${y} Z`
  );
}

function buildCirclePath(cx: number, cy: number, r: number): string {
  'worklet';
  return (
    `M${cx - r},${cy}` +
    ` A${r},${r} 0 1,0 ${cx + r},${cy}` +
    ` A${r},${r} 0 1,0 ${cx - r},${cy} Z`
  );
}

function buildHolePath(params: BuildSvgPathParams): string {
  'worklet';
  const {
    pageX,
    pageY,
    width,
    height,
    maskShape,
    maskPadding,
    maskBorderRadius,
  } = params;

  const x = pageX - maskPadding;
  const y = pageY - maskPadding;
  const w = width + maskPadding * 2;
  const h = height + maskPadding * 2;

  if (maskShape === 'circle') {
    const cx = pageX + width / 2;
    const cy = pageY + height / 2;
    const r = Math.max(w, h) / 2;
    return buildCirclePath(cx, cy, r);
  }

  if (maskShape === 'rounded-rect') {
    return buildRoundedRectPath(x, y, w, h, maskBorderRadius);
  }

  return buildRectPath(x, y, w, h);
}

export function buildSvgPath(
  params: BuildSvgPathParams,
  step: StepRegistration,
  customMaskPath?: MaskPathFn
): string {
  'worklet';
  const { pageX, pageY, width, height, canvasWidth, canvasHeight } = params;
  const backdrop = buildRectPath(0, 0, canvasWidth, canvasHeight);

  if (customMaskPath !== undefined) {
    const hole = customMaskPath({
      position: { x: pageX, y: pageY },
      size: { width, height },
      canvasSize: { width: canvasWidth, height: canvasHeight },
      step,
    });
    return `${backdrop} ${hole}`;
  }

  return `${backdrop} ${buildHolePath(params)}`;
}
