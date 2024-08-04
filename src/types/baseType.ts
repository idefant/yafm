import { TCipher } from './cipher';
import { TTimestamp } from './timestamp';

export type TBase = TCipher & TTimestamp & { id: string };
