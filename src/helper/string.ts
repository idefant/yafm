export const compareObjByStr = <T>(
  a: T,
  b: T,
  callbackfn: (value: T) => string
) => {
  return callbackfn(a).localeCompare(callbackfn(b));
};
