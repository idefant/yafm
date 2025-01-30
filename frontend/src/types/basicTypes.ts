/* eslint-disable no-unused-vars */

import { SimplifyDeep } from 'type-fest';

/**
 * Список значений от 0 до N
 *
 * @example
 * type OutType = ZeroToNRange<3>
 * // => 0 | 1 | 2
 */
export type ZeroToNRange<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : ZeroToNRange<N, [...Acc, Acc['length']]>;

/**
 * Возвращает список от F до T
 *
 * @example
 * type OutType = NToMRange<1, 5>;
 * // => 1 | 2 | 3 | 4
 */
export type NToMRange<F extends number, T extends number> = Exclude<
  ZeroToNRange<T>,
  ZeroToNRange<F>
>;

/**
 * Переименование поля на первом уровне
 *
 * @example
 * type InType = {
 *   foo: string;
 *   bar: number;
 * };
 *
 * type OutType = Rename<InType, 'foo', 'baz'>;
 * // => {
 * //      baz: string;
 * //      bar: number
 * //    }
 */
export type Rename<T, Old extends keyof T, New extends string> = SimplifyDeep<
  Omit<T, Old> & { [key in New]: T[Old] }
>;

/**
 * Замена длинного названия ключа id на стандартный
 *
 * @example
 * type InType = {
 *   bookId: string;
 *   title: string;
 * };
 *
 * type OutType = NormalizeId<{ bookId: string; title: string }, 'bookId'>;
 * // => {
 * //      title: string;
 * //      id: string;
 * //    }
 */
export type NormalizeId<T, OldId extends keyof T> = Rename<T, OldId, 'id'>;

/**
 * Возвращает словарь внешних классов для проброса в сложные компоненты
 *
 * @example
 * type InClass = 'label' | 'input' | 'errorText';
 *
 * type OutClassDict = OuterClasses<InClass>
 * // => {
 * //      label?: string;
 * //      input?: string;
 * //      errorText?: string;
 * //    }
 */
export type OuterClasses<T extends string> = Partial<Record<T, string>>;
