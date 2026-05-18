/**
 * Returns a Promise that resolves after `ms` milliseconds. Use inside a
 * `useTourScrollAdapter` callback to wait for a scroll animation to settle
 * before the library measures the step element.
 *
 * @param ms - Duration in milliseconds.
 *
 * @example
 * ```ts
 * scrollRef.current?.scrollTo({ y, animated: true });
 * await delay(350);
 * ```
 */
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
