/* eslint-disable no-unused-vars */
type IsUndefined<T> = undefined extends T ? true : false;

type IfUndefined<T, TypeIfUndefined = true, TypeIfNotUndefined = false> =
  IsUndefined<T> extends true ? TypeIfUndefined : TypeIfNotUndefined;

type SetNullableIfUndefined<T> = IfUndefined<T, T | null, T>;

type OptionalToNull<T> = {
  [K in keyof T]: SetNullableIfUndefined<T[K]>;
};
type SetOptionalWithout<T, K extends keyof T> = SetOptional<T, Exclude<keyof T, K>>;

type SetUpdatable<T, K extends keyof T = never> = SetOptionalWithout<OptionalToNull<T>, K>;
