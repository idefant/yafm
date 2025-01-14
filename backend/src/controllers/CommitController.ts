import { Response, Request, NextFunction } from 'express';

import CommitService from '#services/CommitService';

class CommitController {
  static async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CommitService.getList(res.locals.token, req.query as any);
      res.send(result);
    } catch (error) {
      next(error);
    }
  }

  static async getActualList(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CommitService.getActualList(res.locals.token, req.query as any);
      res.send(result);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CommitService.create(res.locals.token, req.body);
      res.send(result);
    } catch (error) {
      next(error);
    }
  }
}

export default CommitController;
