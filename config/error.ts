/* eslint-disable no-unused-vars */
import httpStatus from 'http-status';
import { isCelebrateError } from 'celebrate';
import { Request, Response, NextFunction } from 'express';

import APIError from '../helpers/APIError';
import customErrorMessage from '../helpers/joiCustomError';

interface IError extends APIError {
  joi?: { details: [] };
}

/**
 * Error handler. Send stacktrace only during development
 * @public
 */
export const handler = (err: IError, _req: Request, res: Response) => {
  const response = {
    statusCode: err.status,
    //@ts-ignore
    message: err.message || httpStatus[err.status],
    errors: err.errors,
    payload: null,
    stack: err.stack,
  };
  if (process.env.NODE_ENV !== 'development') {
    delete response.stack;
  }

  // to add the status in response header, remove comment from the code below
  res.status(err.status);
  return res.json(response);
};

/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */
export const converter = (
  err: IError | any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let convertedError = err;
  if (isCelebrateError(err)) {
    convertedError = new APIError({
      message: 'Invalid fields',
      status: httpStatus.BAD_REQUEST, //unprocessible entity
      errors: /*customErrorMessage(err.details[]) ||*/ {},
    });
  } else if (!(err instanceof APIError)) {
    convertedError = new APIError({
      message: err.message,
      status: err.status,
      stack: err.stack,
    });
  }

  return handler(convertedError, req, res);
};

/**
 * 500
 */
export const internal = function (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // treat as 404
  if (
    err.message &&
    (~err.message.indexOf('Not found') ||
      ~err.message.indexOf('Cast to ObjectId failed'))
  ) {
    return next();
  }
  // error page
  return handler(err, req, res);
};

/**
 *
 * @param {Error} err
 * @param {} req
 * @param {*} res
 */
export const errorHandler = (
  err: IError,
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (err) {
    const tokenError = new APIError({
      message: 'Unauthorized',
      status: err.status,
      isPublic: true,
    });
    next(tokenError);
  }
  next();
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
export const notFound = (req: Request, res: Response) => {
  const err = new APIError({
    message: 'Not found',
    status: httpStatus.NOT_FOUND,
  });
  return handler(err, req, res);
};