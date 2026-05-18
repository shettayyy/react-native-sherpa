/**
 * Measures a View's position relative to an ancestor node. Unlike
 * `measureInWindow`, this returns coordinates in the ancestor's local
 * coordinate space — making it accurate for computing scroll offsets
 * regardless of how deeply the target is nested.
 *
 * Use this inside a `useTourScrollAdapter` callback to determine how far to
 * scroll before the library highlights the step.
 *
 * @param ref - The target View to measure (e.g. `stepViewRef.current`).
 * @param relativeToRef - The ancestor to measure relative to (e.g.
 *   `scrollRef.current`).
 * @returns Resolved position `{ x, y, width, height }` relative to
 *   `relativeToRef`.
 *
 * @example
 * ```ts
 * const { y } = await measureLayout(viewRef.current, scrollRef.current);
 * scrollRef.current?.scrollTo({ y, animated: true });
 * ```
 */
interface MeasureLayoutTarget {
  measureLayout(
    relativeToRef: unknown,
    onSuccess: (x: number, y: number, width: number, height: number) => void,
    onFail: () => void
  ): void;
}

export function measureLayout(
  ref: MeasureLayoutTarget | null,
  relativeToRef: unknown
): Promise<{ x: number; y: number; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    if (ref === null || relativeToRef == null) {
      reject(new Error('[Sherpa] measureLayout: ref or relativeToRef is null'));
      return;
    }
    ref.measureLayout(
      relativeToRef,
      (x, y, width, height) => resolve({ x, y, width, height }),
      () =>
        reject(new Error('[Sherpa] measureLayout: native measurement failed'))
    );
  });
}
