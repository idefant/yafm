import { JWTPayload } from 'jose';
import { SetRequired } from 'type-fest';

export type Token = SetRequired<JWTPayload, 'sub'>;
