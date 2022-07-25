import { Controller } from '@myforum/building-blocks';
import { Router } from 'express';
import * as swaggerUI from 'swagger-ui-express';

export class DocsController implements Controller {
  public readonly route = '/api';

  public getRouter(): Router {
    const router = Router();

    // TODO: Use Service Discovery
    router.use(
      '/',
      swaggerUI.serve,
      swaggerUI.setup(null, {
        explorer: true,
        swaggerOptions: {
          urls: [
            {
              url: 'http://127.0.0.1:4500/openapi.json',
              name: 'Users',
            },
            {
              url: 'http://127.0.0.1:4001/openapi.json',
              name: 'Posts',
            },
          ],
        },
      }),
    );

    return router;
  }
}
