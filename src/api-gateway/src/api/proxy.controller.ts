import { Controller } from '@myforum/building-blocks';
import { Router } from 'express';
import proxy from 'express-http-proxy';

export class ProxyController implements Controller {
  public readonly route = '/';

  public getRouter(): Router {
    const router = Router();

    router.use('/users', proxy(process.env.USERS_MS_URL));

    router.use('/posts', proxy(process.env.POSTS_MS_URL));

    return router;
  }
}
