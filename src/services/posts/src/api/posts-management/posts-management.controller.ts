import { Controller } from '@myforum/building-blocks';
import { RequestHandler, Router } from 'express';
import { createNewPostActionValidation } from './actions/create-new-post.action';

interface Dependencies {
  createNewPostAction: RequestHandler;
  authMiddleware: RequestHandler;
}

export class PostsManagementController implements Controller {
  public readonly route = '/v1/posts-management';

  constructor(private readonly dependencies: Dependencies) {}

  public getRouter(): Router {
    const router = Router();

    router.post('/', [
      this.dependencies.authMiddleware,
      createNewPostActionValidation,
      this.dependencies.createNewPostAction,
    ]);

    return router;
  }
}
