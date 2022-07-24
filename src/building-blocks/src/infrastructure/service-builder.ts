import { Server } from '@api/server';
import {
  asClass,
  asFunction,
  asValue,
  AwilixContainer,
  createContainer,
  Lifetime,
  Resolver,
} from 'awilix';
import { Application } from 'express';
import * as opentracing from 'opentracing';
import { RedisClientType } from 'redis';
import openApiJsDoc from 'swagger-jsdoc';
import { authMiddleware } from '@api/middlewares/auth/auth.middleware';
import {
  CommandHandler,
  Controller,
  EventSubscriber,
  InMemoryCommandBus,
  InMemoryQueryBus,
  QueryHandler,
  ServiceController,
  tracingMiddleware,
} from '..';
import { registerAsArray } from './container';
import { Logger, logger } from './logger';
import { MessageBus, RabbitMqMessageBus } from './message-bus';
import { TracerBuilder } from './tracer';
import { ConsulServiceDiscovery, ServiceDiscovery } from './service-discovery';
import { JwtTokenProviderService } from './token-provider';
import { KafkaMessageBroker } from './message-broker/kafka/kafka.message-broker';
import { redisClient } from './redis/redis.client';

interface CustomResolution {
  [key: string]: Resolver<any>;
}

const openApiOptions = {
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: 'MyForum - Node.js Microservices & DDD API',
      version: '0.0.1',
      description: 'This is API for MyForum - Node.js Microservices & DDD API.',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-auth-token',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
};

export class ServiceBuilder {
  private serviceName: string;

  private container: AwilixContainer = createContainer();

  public setName(name: string) {
    this.serviceName = name;

    this.container.register({
      logger: asValue(logger(name)),
      tokenProvider: asClass(JwtTokenProviderService).singleton(),
      authMiddleware: asFunction(authMiddleware, {
        lifetime: Lifetime.SCOPED,
      }),
    });

    const tracerBuilder = new TracerBuilder(name).build();

    opentracing.initGlobalTracer(tracerBuilder);

    const tracer = opentracing.globalTracer();

    this.container.register({
      tracer: asValue(tracer),
      tracingMiddleware: asFunction(tracingMiddleware),
    });

    return this;
  }

  public setControllers(controllers: Resolver<Controller>[]) {
    this.container.register({
      controllers: registerAsArray(controllers),
    });

    return this;
  }

  public setServiceControllers(controllers: Resolver<ServiceController>[]) {
    this.container.register({
      serviceControllers: registerAsArray(controllers),
    });

    return this;
  }

  public loadActions(actionPaths: string[]) {
    this.container.loadModules(actionPaths, {
      formatName: 'camelCase',
      resolverOptions: {
        lifetime: Lifetime.SCOPED,
        register: asFunction,
      },
    });

    return this;
  }

  public setCommandHandlers(commandHandlers: Resolver<CommandHandler<any, any>>[]) {
    this.container.register({
      commandHandlers: registerAsArray(commandHandlers),
      commandBus: asClass(InMemoryCommandBus).singleton(),
    });

    return this;
  }

  public setQueryHandlers(queryHandlers: Resolver<QueryHandler<any, any>>[]) {
    this.container.register({
      queryHandlers: registerAsArray(queryHandlers),
      queryBus: asClass(InMemoryQueryBus).singleton(),
    });

    return this;
  }

  public setEventSubscribers(eventSubscribers: Resolver<EventSubscriber<any>>[]) {
    this.container.register({
      eventSubscribers: registerAsArray(eventSubscribers),
    });

    return this;
  }

  public useKafka() {
    this.container.register({
      messageBroker: asClass(KafkaMessageBroker)
        .inject(() => ({
          url: 'localhost:9092',
          serviceName: this.serviceName,
        }))
        .singleton(),
    });

    return this;
  }

  public useOpenApi(apiUrls: string[]) {
    const openApiDocs = openApiJsDoc({
      ...openApiOptions,
      apis: apiUrls,
    });

    this.container.register({
      openApiDocs: asValue(openApiDocs),
    });

    return this;
  }

  public useRabbitMQ(url: string) {
    this.container.register({
      messageBus: asClass(RabbitMqMessageBus)
        .inject(() => ({
          rabbitUrl: url,
          serviceName: this.serviceName,
        }))
        .singleton(),
    });

    return this;
  }

  public useRedis(url: string) {
    this.container.register({
      redisClient: asValue(redisClient(url)),
    });

    return this;
  }

  public useConsul(url: string) {
    this.container.register({
      serviceDiscovery: asClass(ConsulServiceDiscovery)
        .inject(() => ({
          consulUrl: url,
        }))
        .singleton(),
    });

    return this;
  }

  public setCustom(props: CustomResolution) {
    this.container.register(props);

    return this;
  }

  public build() {
    return {
      bootstrap: async () => {
        const resolvedLogger = this.container.resolve<Logger>('logger');

        this.registerCommonDependenciesIfNotSet();

        resolvedLogger.info('Loading service dependencies...');

        if (!this.container.hasRegistration('openApiDocs')) {
          this.container.register({
            openApiDocs: asValue(
              openApiJsDoc({
                ...openApiOptions,
                apis: [],
              }),
            ),
          });
        }

        this.container.register({
          server: asClass(Server).singleton(),
        });

        if (this.container.hasRegistration('redisClient')) {
          const resolvedRedisClient = this.container.resolve<RedisClientType>('redisClient');

          resolvedRedisClient
            .on('connect', () => {
              resolvedLogger.info('[Cache Provider] Redis connected.');
            })
            .on('error', (error) => {
              resolvedLogger.error('[Cache Provider] Redis connection failed.', error);
            })
            .on('end', () => {
              resolvedLogger.info('[Cache Provider] Redis conenction closed.');
            });

          await resolvedRedisClient.connect();
        }

        if (this.container.hasRegistration('messageBus')) {
          const messageBus = this.container.resolve<MessageBus>('messageBus');

          await messageBus.init();
        }

        const server = this.container.resolve<Server>('server');

        this.container.register({
          app: asValue(server.getApp()),
        });

        let serviceControllers = [];

        if (this.container.hasRegistration('serviceControllers')) {
          serviceControllers =
            this.container.resolve<ServiceController[]>('serviceControllers') ?? [];
        }

        const controllerSetupPromises = serviceControllers.map((controller) => controller.setup());

        await Promise.all(controllerSetupPromises);

        resolvedLogger.info('Service bootstrapped successfully!');
      },
      listen: async (port: number) => this.listen(port),
      getApp: () => {
        const app = this.container.resolve<Application>('app');

        return app;
      },
      getContainer: () => {
        return this.container;
      },
      cleanUpOnExit: (cleanUpCallback: () => Promise<void>) => {
        this.cleanUpOnExit(cleanUpCallback);
      },
    };
  }

  public async listen(port: number) {
    const app = this.container.resolve<Application>('app');

    const resolvedLogger = this.container.resolve<Logger>('logger');

    if (this.container.hasRegistration('serviceDiscovery')) {
      const serviceDiscovery = this.container.resolve<ServiceDiscovery>('serviceDiscovery');

      await serviceDiscovery.registerService({
        port,
        address: '127.0.0.1',
        name: this.serviceName,
        health: {
          endpoint: '/health',
          intervalSeconds: 10,
          timeoutSeconds: 1,
        },
      });
    }

    app.listen(port, async () => {
      resolvedLogger.info(`Service started listening on http://localhost:${port}`, {
        port,
      });
    });
  }

  private cleanUpOnExit(cleanup: () => Promise<void>) {
    const resolvedLogger = this.container.resolve<Logger>('logger');

    // so the program will not close instantly
    process.stdin.resume();

    async function exitHandler(options, _exitCode) {
      if (options.error) {
        resolvedLogger.error(`Unhandled error occured: ${options.error.message}`);
        resolvedLogger.error(options.error.stack);
      }

      if (options.cleanup || options.exit) {
        await cleanup();
      }

      if (options.exit) process.exit();
    }

    // do something when app is closing
    process.on('exit', exitHandler.bind(null, { cleanup: true }));

    // catches ctrl+c event
    process.on('SIGINT', exitHandler.bind(null, { exit: true }));

    // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
    process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

    // catches uncaught exceptions
    process.on('uncaughtException', (error) => exitHandler.call(null, { exit: true, error }));
  }

  private registerCommonDependenciesIfNotSet() {
    if (!this.container.hasRegistration('controllers')) {
      this.container.register({
        controllers: registerAsArray([]),
      });
    }

    if (!this.container.hasRegistration('commandHandlers')) {
      this.container.register({
        commandHandlers: registerAsArray([]),
      });
    }

    if (!this.container.hasRegistration('queryHandlers')) {
      this.container.register({
        queryHandlers: registerAsArray([]),
      });
    }

    if (!this.container.hasRegistration('subscribers')) {
      this.container.register({
        subscribers: registerAsArray([]),
      });
    }
  }
}
