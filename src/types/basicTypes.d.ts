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

// Получение элементов списка
type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

// Список значений от 0 до N
type ZeroToNRange<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : ZeroToNRange<N, [...Acc, Acc['length']]>;

// Возвращает список от F до T
type NToMRange<F extends number, T extends number> = Exclude<ZeroToNRange<T>, ZeroToNRange<F>>;

// Возвращает обЪект с переданным списком ключей и типом значений
type FromEntries<T extends ReadonlyArray<string>, V = string> = {
  [K in T extends ReadonlyArray<infer U> ? U : never]: V;
};

// Переименование поля на первом уровне
type Rename<T, Old extends keyof T, New extends string> = Simplify<
  Omit<T, Old> & { [key in New]: T[Old] }
>;

// Замена большого ключа id на стандартный
type NormalizeId<T, OldId extends keyof T> = Simplify<Rename<T, OldId, 'id'>>;
