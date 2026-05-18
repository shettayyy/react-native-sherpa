import { createContext, type ComponentRef, type RefObject } from 'react';
import type { View } from 'react-native';

/**
 * Async function registered by a scroll container to bring a tour step into
 * view before the library measures and highlights it.
 *
 * @param stepName - The name of the step about to be activated. Use this when
 *   different steps need different scroll behaviour — for example, snapping the
 *   first step to the top while centering all others. If every step scrolls the
 *   same way, ignore it with `_`.
 * @param viewRef - Ref to the TourStep's underlying View. Pass to
 *   `measureLayout` to compute the step's offset relative to the scroll
 *   container, then call `scrollTo` / `scrollToOffset` accordingly.
 *
 * @example
 * ```tsx
 * // Same scroll behaviour for every step — stepName ignored
 * useTourScrollAdapter('my-tour', async (_, viewRef) => {
 *   const { y, height } = await measureLayout(viewRef.current, scrollRef.current);
 *   const centeredY = y - containerHeight / 2 + height / 2;
 *   scrollRef.current?.scrollTo({ y: Math.max(0, centeredY), animated: true });
 *   await delay(350);
 * });
 *
 * // Different behaviour per step
 * useTourScrollAdapter('my-tour', async (stepName, viewRef) => {
 *   if (stepName === 'hero-banner') {
 *     scrollRef.current?.scrollTo({ y: 0, animated: true });
 *     await delay(200);
 *     return;
 *   }
 *   const { y, height } = await measureLayout(viewRef.current, scrollRef.current);
 *   const centeredY = y - containerHeight / 2 + height / 2;
 *   scrollRef.current?.scrollTo({ y: Math.max(0, centeredY), animated: true });
 *   await delay(350);
 * });
 * ```
 */
export type ScrollAdapterFn = (
  stepName: string,
  viewRef: RefObject<ComponentRef<typeof View> | null>
) => Promise<void> | void;

export type ScrollAdapterRegistry = Map<string, ScrollAdapterFn>;

export const ScrollAdapterContext = createContext<
  RefObject<ScrollAdapterRegistry>
>({ current: new Map() });
