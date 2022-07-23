import { Controller } from '@myforum/building-blocks';
import { RequestHandler, Router } from 'express';

interface Dependencies {
  getAllPostsAction: RequestHandler;
}

export class PostCatalogueController implements Controller {
  public readonly route = '/v1/posts';

  constructor(private readonly dependencies: Dependencies) {}

  public getRouter(): Router {
    const router = Router();

    router.get('/', this.dependencies.getAllPostsAction);

    return router;
  }
}
