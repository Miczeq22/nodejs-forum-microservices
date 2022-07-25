import express, { Application, RequestHandler } from 'express';
import apiMetrics from 'prometheus-api-metrics';
import status from 'http-status';
import * as swaggerUI from 'swagger-ui-express';
import { NotFoundError } from '@errors/index';
import { Controller } from './controller';
import corsMiddleware from './middlewares/cors/cors.middleware';
import { applySecurityMiddleware } from './middlewares/security/security.middleware';
import { errorHandlerMiddleware } from './middlewares/error-handler/error-handler.middleware';
import { Logger } from '..';

interface Dependencies {
  controllers: Controller[];
  logger: Logger;
  openApiDocs: object;
  tracingMiddleware: RequestHandler;
}

export class Server {
  private app: Application;

  constructor(private readonly dependencies: Dependencies) {
    this.app = express();

    this.app.use(express.json());

    this.app.use(corsMiddleware);

    applySecurityMiddleware(this.app);

    this.app.use(apiMetrics());

    this.app.use(this.dependencies.tracingMiddleware);

    this.app.get('/health', (_, res) => {
      res.sendStatus(status.OK);
    });

    this.dependencies.controllers.forEach((controller) =>
      this.app.use(controller.route, controller.getRouter()),
    );

    if (this.dependencies.openApiDocs !== null) {
      this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(this.dependencies.openApiDocs));

      this.app.use('/openapi.json', (_, res) => res.json(this.dependencies.openApiDocs));
    }

    this.app.use('*', (req, _, next) => {
      next(new NotFoundError(`Route "${req.originalUrl}" is not supported.`));
    });

    this.app.use(errorHandlerMiddleware(this.dependencies.logger));
  }

  public getApp() {
    return this.app;
  }
}
