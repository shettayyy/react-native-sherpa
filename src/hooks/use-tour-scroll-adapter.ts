import { useContext, useEffect } from 'react';

import type { RegisteredTourId } from '@sherpa/types';
import {
  ScrollAdapterContext,
  type ScrollAdapterFn,
} from '../contexts/scroll-adapter-context';

/**
 * Registers a scroll adapter for a given tour so the library can bring each
 * step into view before measuring and highlighting it.
 *
 * Call this hook inside the component that owns the scroll container ref. The
 * adapter receives the step name and the step's View ref; use `measureLayout`
 * to compute the offset relative to the scroll container, then scroll to it.
 *
 * The adapter is optional. Tours without a registered adapter work exactly as
 * before — all steps must already be on screen.
 *
 * The adapter's first argument (`stepName`) can be ignored with `_` when every
 * step scrolls the same way. Use it when individual steps need different
 * behaviour, such as snapping one step to the top while centering the rest.
 *
 * @param tourId - The tour this adapter applies to.
 * @param adapter - Async function called before each step is measured. Receives
 *   the step name and the step's View ref. Await any scroll animation and
 *   settling delay inside this function before returning — the library will not
 *   call `measureInWindow` until the adapter resolves.
 *
 * @example
 * ```tsx
 * const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
 * const scrollHeightRef = useRef(0);
 *
 * useTourScrollAdapter('my-tour', async (_, viewRef) => {
 *   const { y, height } = await measureLayout(viewRef.current, scrollRef.current);
 *   const centeredY = y - scrollHeightRef.current / 2 + height / 2;
 *   scrollRef.current?.scrollTo({ y: Math.max(0, centeredY), animated: true });
 *   await delay(350); // wait for the scroll animation to settle
 * });
 *
 * // Wire the ScrollView:
 * <ScrollView
 *   ref={scrollRef}
 *   onLayout={(e) => { scrollHeightRef.current = e.nativeEvent.layout.height; }}
 * />
 * ```
 */
export function useTourScrollAdapter(
  tourId: RegisteredTourId,
  adapter: ScrollAdapterFn
): void {
  const registry = useContext(ScrollAdapterContext);

  useEffect(() => {
    const currentRegistry = registry.current;
    currentRegistry.set(tourId, adapter);
    return () => {
      currentRegistry.delete(tourId);
    };
  }, [tourId, adapter, registry]);
}
