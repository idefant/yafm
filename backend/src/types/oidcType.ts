import { Request } from 'express';
import { UserinfoResponse } from 'openid-client';

export type IdTokenClaims = NonNullable<Request['oidc']['idTokenClaims']> & { groups?: string[] };

export type UserInfo = UserinfoResponse & { groups?: string[] };
