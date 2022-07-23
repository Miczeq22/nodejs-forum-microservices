import { Controller } from '@myforum/building-blocks';
import { RequestHandler, Router } from 'express';
import { registerNewAccountActionValidation } from './actions/register-new-account.action';

interface Dependencies {
  registerNewAccountAction: RequestHandler;
}

export class PlatformRegistrationController implements Controller {
  public readonly route = '/v1/platform-registration';

  constructor(private readonly dependenices: Dependencies) {}

  public getRouter(): Router {
    const router = Router();

    router.post('/', [
      registerNewAccountActionValidation,
      this.dependenices.registerNewAccountAction,
    ]);

    return router;
  }
}
