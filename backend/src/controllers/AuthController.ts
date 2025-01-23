import { Response, Request, NextFunction } from 'express';

import HttpException from '#models/HttpException';
import { IdTokenClaims } from '#types/oidcType';

class AuthController {
  static async checkIsAuthorized(
    req: Request,
    res: Response<{ isAuth: false } | { isAuth: true; isUser: boolean }>,
    next: NextFunction,
  ) {
    try {
      const groupUser = process.env.GROUP_USER;
      const isAuth = req.oidc.isAuthenticated();

      if (!isAuth) {
        res.json({ isAuth: false });
        return;
      }

      if (!req.oidc.accessToken || !req.oidc.idTokenClaims) {
        throw new HttpException();
      }

      const claims = req.oidc.idTokenClaims as IdTokenClaims;
      const isUser = !groupUser || (!!claims.groups && claims.groups.includes(groupUser));

      const { isExpired, refresh } = req.oidc.accessToken;
      if (!isExpired()) {
        res.json({ isAuth: true, isUser });
        return;
      }

      refresh()
        .then(() => {
          res.json({ isAuth: true, isUser });
        })
        .catch(() => {
          res.json({ isAuth: false });
        });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(res.locals.user);
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.oidc.accessToken) {
        throw new HttpException();
      }

      const { refresh } = req.oidc.accessToken;
      await refresh();
      res.json({ status: 'OK' });
    } catch {
      next(new HttpException(401));
    }
  }
}

export default AuthController;
