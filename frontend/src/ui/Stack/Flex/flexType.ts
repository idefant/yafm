import { LiteralUnion } from 'type-fest';

export type FlexDirection = 'row' | 'column';
export type FlexJustify =
  | 'start'
  | 'center'
  | 'end'
  | 'spaceBetween'
  | 'spaceAround'
  | 'spaceEvenly';
export type FlexAlign = 'start' | 'center' | 'end';
export type FlexWrap = 'wrap' | 'nowrap';
export type FlexGap = LiteralUnion<4 | 8 | 16 | 24 | 32, number>;
