export const createKeysDict = <K extends string | number, V>(keys: K[], value: V) =>
  Object.fromEntries(keys.map((key) => [key, value]));
