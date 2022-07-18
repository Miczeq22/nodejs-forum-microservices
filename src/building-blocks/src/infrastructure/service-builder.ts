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

interface CustomResolution {
  [key: string]: Resolver<any>;
}

export class ServiceBuilder {
  private serviceName: string;

  private container: AwilixContainer = createContainer();

  public setName(name: string) {
    this.serviceName = name;

    this.container.register({
      logger: asValue(logger(name)),
      tokenProvider: asClass(JwtTokenProviderService).singleton(),
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
    if (!this.container.hasRegistration('messageBus')) {
      throw new Error("Can't subscribe to command. Message Bus is not set.");
    }

    this.container.register({
      subscribers: registerAsArray(eventSubscribers),
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

        this.container.register({
          server: asClass(Server).singleton(),
        });

        if (this.container.hasRegistration('messageBus')) {
          const messageBus = this.container.resolve<MessageBus>('messageBus');

          await messageBus.init();
        }

        this.registerEventSubscribers();

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

  private async registerEventSubscribers() {
    if (!this.container.hasRegistration('messageBus')) {
      return;
    }

    const subscribers = this.container.resolve<EventSubscriber<any>[]>('subscribers');
    const messageBus = this.container.resolve<MessageBus>('messageBus');

    const promises = subscribers.map((subscriber) => {
      const [service, ...rest] = subscriber.type.split('.');

      return messageBus.subscribeToEvent(rest.join('.'), service, (event, ctx) =>
        subscriber.handle(event, ctx),
      );
    });
    await Promise.all(promises);
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
