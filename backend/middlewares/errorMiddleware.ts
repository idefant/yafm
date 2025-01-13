import { NextFunction, Response, Request } from 'express';

import HttpException from '../models/HttpException';

const errorMiddleware = (
  err: HttpException | Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  if (err instanceof HttpException) {
    res.status(err.errorCode).json({ message: err.message, debug_message: err.debugMessage });
  } else {
    res.status(500).json({ debug_message: err.message });
  }
};

export default errorMiddleware;
