type GenericFn = (...args: any[]) => any;

/**
 * Higher-order function that returns the callback's
 * return value or undefined for TypeScript purposes.
 */
export function returnTypeGuard<Callback extends GenericFn>(
  callback: Callback,
  ...args: Parameters<Callback>
): ReturnType<Callback> | undefined {
  return callback(...args);
}
