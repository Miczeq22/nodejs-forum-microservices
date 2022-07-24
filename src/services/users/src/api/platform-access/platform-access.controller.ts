import { Controller } from '@myforum/building-blocks';
import { RequestHandler, Router } from 'express';
import { loginActionValidation } from './actions/login.action';

interface Dependencies {
  loginAction: RequestHandler;
}

export class PlatformAccessController implements Controller {
  public readonly route = '/v1/platform-access';

  constructor(private readonly dependencies: Dependencies) {}

  public getRouter(): Router {
    const router = Router();

    router.post('/login', [loginActionValidation, this.dependencies.loginAction]);

    return router;
  }
}
