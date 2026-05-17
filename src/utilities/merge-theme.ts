import type { SherpaTheme } from '@sherpa/types';

import { DEFAULT_THEME } from './default-theme';

export function mergeTheme(partial?: Partial<SherpaTheme>): SherpaTheme {
  if (partial === undefined) {
    return DEFAULT_THEME;
  }

  return {
    overlay: { ...DEFAULT_THEME.overlay, ...partial.overlay },
    tooltip: { ...DEFAULT_THEME.tooltip, ...partial.tooltip },
    beacon: { ...DEFAULT_THEME.beacon, ...partial.beacon },
  };
}
