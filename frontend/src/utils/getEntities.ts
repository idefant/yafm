import { Dictionary } from '@reduxjs/toolkit';

import { getProp } from './getProp';

type EntriesKey = string | number;

/* eslint-disable no-unused-vars */
type GetEntries = {
  <T, K extends EntriesKey>(arr: T[], keyPath: string): Dictionary<T>;
  <T, K extends EntriesKey>(arr: T[], getKey: (value: T) => K): Dictionary<T>;
};

export const getEntities: GetEntries = <T, K extends EntriesKey>(
  arr: T[],
  pathOrGetGroupName: string | ((value: T) => K),
  /* eslint-enable no-unused-vars */
) =>
  Object.fromEntries(
    arr.map((item) => [
      typeof pathOrGetGroupName === 'string'
        ? getProp(item, pathOrGetGroupName)
        : pathOrGetGroupName(item),
      item,
    ]),
  );
