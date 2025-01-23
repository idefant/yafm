import { Response, Request, NextFunction } from 'express';

import HttpException from '#models/HttpException';
import { IdTokenClaims } from '#types/oidcType';

export const getUserData = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.oidc.idTokenClaims) {
      throw new HttpException();
    }

    const claims = req.oidc.idTokenClaims as IdTokenClaims;

    res.locals.user = {
      sub: claims.sub,
      name: claims.name,
      given_name: claims.given_name,
      family_name: claims.family_name,
      middle_name: claims.middle_name,
      nickname: claims.nickname,
      preferred_username: claims.preferred_username,
      profile: claims.profile,
      picture: claims.picture,
      website: claims.website,
      email: claims.email,
      email_verified: claims.email_verified,
      gender: claims.gender,
      birthdate: claims.birthdate,
      zoneinfo: claims.zoneinfo,
      locale: claims.locale,
      phone_number: claims.phone_number,
      updated_at: claims.updated_at,
      address: claims.address,
      groups: claims.groups,
    };

    next();
  } catch (error) {
    next(error);
  }
};
