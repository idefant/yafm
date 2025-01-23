import { Response, Request, NextFunction } from 'express';

import HttpException from '#models/HttpException';
import CommitService from '#services/CommitService';

class CommitController {
  static async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = res.locals;
      if (!user) {
        throw new HttpException();
      }

      const result = await CommitService.getList(user, req.query as any);
      res.send(result);
    } catch (error) {
      next(error);
    }
  }

  static async getActualList(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = res.locals;
      if (!user) {
        throw new HttpException();
      }

      const result = await CommitService.getActualList(user, req.query as any);
      res.send(result);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = res.locals;
      if (!user) {
        throw new HttpException();
      }

      const result = await CommitService.create(user, req.body);
      res.send(result);
    } catch (error) {
      next(error);
    }
  }
}

export default CommitController;
