import { Controller } from '@myforum/building-blocks';
import { RequestHandler, Router } from 'express';

interface Dependencies {
  createNewPostAction: RequestHandler;
}

export class PostsManagementController implements Controller {
  public readonly route = '/post-management';

  constructor(private readonly dependencies: Dependencies) {}

  public getRouter(): Router {
    const router = Router();

    router.post('/', this.dependencies.createNewPostAction);

    return router;
  }
}
