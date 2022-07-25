/* eslint-disable no-param-reassign */
import { UnauthorizedError } from '@errors/unauthorized.error';
import { RequestHandler } from 'express';

export const getUserContextMiddleware = (): RequestHandler => (req, res, next) => {
  const context = {
    accountId: req.headers['x-account-id'] || null,
  };

  if (Object.values(context).some((value) => value === null)) {
    return next(new UnauthorizedError());
  }

  res.locals.context = context;

  next();
};
