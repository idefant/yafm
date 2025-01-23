import { Response, Request, NextFunction } from 'express';

import HttpException from '#models/HttpException';

export const checkIsExpiredSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.oidc.accessToken) {
      throw new HttpException();
    }

    const { isExpired } = req.oidc.accessToken;
    if (isExpired()) {
      throw new HttpException(401);
    }

    next();
  } catch (error) {
    next(error);
  }
};
