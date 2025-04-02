import { Response, Request, NextFunction } from 'express';

import HttpException from '#models/HttpException';
import { IdTokenClaims } from '#types/oidcType';

export const checkUserGroup = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.oidc.idTokenClaims) {
      throw new HttpException();
    }

    const groupUser = process.env.OIDC_GROUP_USER;
    const claims = req.oidc.idTokenClaims as IdTokenClaims;

    if (groupUser) {
      if (!claims.groups) {
        throw new HttpException(403, 'Forbidden', 'IdP не делится списком групп пользователя');
      }
      if (!claims.groups.includes(groupUser)) {
        throw new HttpException(403, 'Forbidden', 'У пользователя недостаточно прав');
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
