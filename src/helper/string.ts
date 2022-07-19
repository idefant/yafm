// eslint-disable-next-line no-unused-vars
export const compareObjByStr = <T>(a: T, b: T, callbackfn: (value: T) => string) => (
  callbackfn(a).localeCompare(callbackfn(b))
);
