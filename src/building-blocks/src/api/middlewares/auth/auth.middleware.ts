/* eslint-disable no-param-reassign */
import { UnauthorizedError } from '@errors/unauthorized.error';
import { TokenProviderService } from '@infrastructure/token-provider';
import { RequestHandler } from 'express';

interface Dependencies {
  tokenProvider: TokenProviderService;
}

export const authMiddleware =
  ({ tokenProvider }: Dependencies): RequestHandler =>
  (req, res, next) => {
    const token = req.headers['x-auth-token'] ? req.headers['x-auth-token'].slice(7) : null;

    if (!token) {
      throw new UnauthorizedError();
    }

    const { accountId } = tokenProvider.verifyAndDecodeToken<{ accountId: string }>(
      token as string,
    );

    res.locals.accountId = accountId;

    next();
  };
