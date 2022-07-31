import { Controller } from '@myforum/building-blocks';
import { RequestHandler, Router } from 'express';
import { addNewCommentActionValidation } from './actions/add-new-comment.action';

interface Dependencies {
  getAllPostsAction: RequestHandler;
  getSinglePostAction: RequestHandler;
  addNewCommentAction: RequestHandler;
  getUserContextMiddleware: RequestHandler;
}

export class PostCatalogueController implements Controller {
  public readonly route = '/v1/posts';

  constructor(private readonly dependencies: Dependencies) {}

  public getRouter(): Router {
    const router = Router();

    router.get('/', this.dependencies.getAllPostsAction);

    router.get('/:id', this.dependencies.getSinglePostAction);

    router.post('/:id/comments', [
      this.dependencies.getUserContextMiddleware,
      addNewCommentActionValidation,
      this.dependencies.addNewCommentAction,
    ]);

    return router;
  }
}
