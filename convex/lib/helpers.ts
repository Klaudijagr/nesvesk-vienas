/**
 * True when the value is a string with at least one character.
 * Mirrors the truthiness check on an optional string: undefined, null and ""
 * are all treated as "not set".
 */
export const isNonEmptyString = (
  value: string | null | undefined
): value is string => value !== undefined && value !== null && value !== "";

/**
 * Run `fn` over `items` strictly one at a time, in order, and collect the
 * results. Use it where each step depends on the previous one having finished
 * (dependent database reads/writes, rate-limited external calls).
 */
export const mapSequential = async <T, R>(
  items: readonly T[],
  fn: (item: T) => Promise<R>
): Promise<R[]> => {
  const results: R[] = [];
  const step = async (index: number): Promise<void> => {
    if (index >= items.length) {
      return;
    }
    results.push(await fn(items[index]));
    await step(index + 1);
  };
  await step(0);
  return results;
};
