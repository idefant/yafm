import { NextFunction, Request, Response } from 'express';
import { AnySchema, ValidationError } from 'yup';

import HttpException from '../models/HttpException';

const checkSchemaMiddleware = (data: keyof Request) => (
  (schema: AnySchema) => (
    async (req: Request, _res: Response, next: NextFunction) => {
      try {
        await schema.validate(req[data]);
        next();
      } catch (error) {
        next(
          new HttpException(
            500,
            'Wrong request parameters',
            error instanceof ValidationError ? error.message : undefined,
          ),
        );
      }
    }
  )
);

export const body = checkSchemaMiddleware('body');
export const params = checkSchemaMiddleware('params');
export const query = checkSchemaMiddleware('query');
