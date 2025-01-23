class HttpException extends Error {
  errorCode: number;

  debugMessage?: string;

  constructor(errorCode = 500, message = '', debugMessage: string | undefined = undefined) {
    super(message);
    this.errorCode = errorCode;
    this.debugMessage = debugMessage;
  }
}

export default HttpException;

/**
 * @openapi
 * components:
 *  schemas:
 *    HttpException:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 */
