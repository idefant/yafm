/* eslint-disable no-unused-vars */

export const mapMerge = <S, T extends S>(
  arr: T[],
  predicate: (elem: T, index: number, obj: T[]) => boolean,
  updatedParams: S,
) => {
  const foundElemIndex = arr.findIndex(predicate);
  if (foundElemIndex === -1) return;
  arr[foundElemIndex] = { ...arr[foundElemIndex], ...updatedParams };
  return arr[foundElemIndex];
};

/**
 * Removes all elements from array that predicate returns truthy for and returns an array of the removed elements.
 * The predicate is invoked with three arguments: (value, index, array).
 */
export const remove = <T>(arr: T[], predicate: (value: T, index: number, obj: T[]) => unknown) => {
  const foundElemIndex = arr.findIndex(predicate);
  if (foundElemIndex === -1) return;
  const foundElem = arr[foundElemIndex];
  arr.splice(foundElemIndex, 1);
  return foundElem;
};
