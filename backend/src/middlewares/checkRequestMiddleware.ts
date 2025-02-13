import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import HttpException from '#models/HttpException';

const checkSchemaMiddleware = (data: keyof Request) => (
  (schema: z.ZodSchema) => (
    async (req: Request, _res: Response, next: NextFunction) => {
      const parsingResult = schema.safeParse(req[data]);
      if (!parsingResult.success) {
        next(
          new HttpException(500, 'Wrong request parameters', parsingResult.error.message),
        );
      }
      next();
    }
  )
);

export const body = checkSchemaMiddleware('body');
export const params = checkSchemaMiddleware('params');
export const query = checkSchemaMiddleware('query');
