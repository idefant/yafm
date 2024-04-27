import { IfNever } from 'type-fest';

import { getProp } from './getProp';

type GroupKey = string | number | boolean | null | undefined;

type GroupByReturn<T, K extends GroupKey> = Record<
  | Exclude<K, null | undefined | boolean>
  | IfNever<Extract<K, null>, never, 'null'>
  | IfNever<Extract<K, undefined>, never, 'undefined'>
  | IfNever<Extract<K, false>, never, 'false'>
  | IfNever<Extract<K, true>, never, 'true'>,
  T[]
>;

/* eslint-disable no-unused-vars */
type GroupBy = {
  <T, K extends GroupKey>(arr: T[], path: string): GroupByReturn<T, K>;
  <T, K extends GroupKey>(arr: T[], getGroupName: (value: T) => K): GroupByReturn<T, K>;
};
/* eslint-enable no-unused-vars */

export const groupBy: GroupBy = <T, K extends GroupKey>(
  arr: T[],
  pathOrGetGroupName: string | ((value: T) => K),
) => {
  const groups: Record<string, T[]> = {} as any;

  arr.forEach((value) => {
    const groupName =
      typeof pathOrGetGroupName === 'string'
        ? getProp(value, pathOrGetGroupName)
        : String(pathOrGetGroupName(value));

    if (!(groupName in groups)) {
      groups[groupName] = [];
    }
    groups[groupName].push(value);
  });

  return groups as GroupByReturn<T, K>;
};
