import { LiteralUnion } from 'type-fest';

export type GridGap = LiteralUnion<0 | 4 | 8 | 16 | 24 | 32, number>;
