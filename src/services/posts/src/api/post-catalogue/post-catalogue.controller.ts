import { Controller } from '@myforum/building-blocks';
import { RequestHandler, Router } from 'express';

interface Dependencies {
  getAllPostsAction: RequestHandler;
  getSinglePostAction: RequestHandler;
}

export class PostCatalogueController implements Controller {
  public readonly route = '/v1/posts';

  constructor(private readonly dependencies: Dependencies) {}

  public getRouter(): Router {
    const router = Router();

    router.get('/', this.dependencies.getAllPostsAction);

    router.get('/:id', this.dependencies.getSinglePostAction);

    return router;
  }
}
