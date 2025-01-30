/* eslint-disable no-unused-vars */

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

/**
 * Возвращает словарь внешних классов для проброса в сложные компоненты
 * @example OuterClasses<'label' | 'input' | 'errorText'>
 * // => {
 * //      label?: string;
 * //      input?: string;
 * //      errorText?: string;
 * //    }
 */
type OuterClasses<T extends string> = Partial<Record<T, string>>;
