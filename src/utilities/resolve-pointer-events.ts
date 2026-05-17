import type { InteractionMode } from '@sherpa/types';

type PointerEventValue = 'none' | 'box-none' | 'box-only' | 'auto';

export function resolvePointerEvents(mode: InteractionMode): PointerEventValue {
  if (mode === 'passthrough' || mode === 'observe' || mode === 'free') {
    return 'none';
  }
  return 'box-only';
}
