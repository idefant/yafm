import { type JWTVerifyGetKey, createRemoteJWKSet, jwtVerify } from 'jose';

import type { NextFunction, Request, Response } from 'express';

let getJsonWebKeySet: JWTVerifyGetKey | null = null;

const parseBearerToken = (req: Request): string | null => {
  const [type, token] = req.headers.authorization?.split(' ') ?? [];

  if (type !== 'Bearer') {
    return null;
  }

  if (!token) {
    return null;
  }

  return token;
};

export const verifyJwtMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): undefined | Response => {
  const token = parseBearerToken(req);

  if (!token) {
    console.error('Bearer token is falsy');
    return res.sendStatus(401);
  }

  if (!getJsonWebKeySet) {
    try {
      getJsonWebKeySet = createRemoteJWKSet(new URL(process.env.API_JSON_WEB_KEY_SET_URL!));
    } catch (error) {
      console.error('Unable to call createRemoteJWKSet', error);
      return res.sendStatus(401);
    }
  }

  jwtVerify(token, getJsonWebKeySet)
    .then((data) => {
      res.locals.token = data.payload;
      next();
    })
    .catch((error) => {
      console.error('Unable to verify jwt', error);
      res.sendStatus(401);
    });
};
