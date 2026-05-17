import { Platform, StatusBar } from 'react-native';
import type { ElementMeasurement } from '@sherpa/types';

interface Measurable {
  measureInWindow(
    callback: (x: number, y: number, width: number, height: number) => void
  ): void;
}

export function measureInWindow(ref: Measurable): Promise<ElementMeasurement> {
  return new Promise((resolve) => {
    ref.measureInWindow((x, y, width, height) => {
      /*
       * measureInWindow on Android returns y starting below the status bar.
       * The overlay Modal uses statusBarTranslucent so its origin is the true
       * screen top. Adding statusBarOffset aligns the two coordinate spaces,
       * and this holds for both old RN (no edge-to-edge) and new RN (edge-to-edge).
       */
      const statusBarOffset =
        Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;
      resolve({ pageX: x, pageY: y + statusBarOffset, width, height });
    });
  });
}
