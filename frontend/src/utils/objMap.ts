import { Dictionary } from '@reduxjs/toolkit';

export const objMap = <T, S, TStrict extends boolean = false>(
  /* eslint-disable no-unused-vars */
  obj: Record<string, T>,
  callback: (value: T, key: string) => S,
  options?: { strict?: TStrict },
  /* eslint-enable no-unused-vars */
): TStrict extends true ? Record<string, S> : Dictionary<S> =>
  Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, callback(value, key)]));
