import { AwilixContainer, Resolver } from 'awilix';
import { Application } from 'express';
import { CommandHandler, Controller, EventSubscriber, QueryHandler, ServiceController } from '..';
interface CustomResolution {
    [key: string]: Resolver<any>;
}
export declare class ServiceBuilder {
    private serviceName;
    private container;
    setName(name: string): this;
    setControllers(controllers: Resolver<Controller>[]): this;
    setServiceControllers(controllers: Resolver<ServiceController>[]): this;
    loadActions(actionPaths: string[]): this;
    setCommandHandlers(commandHandlers: Resolver<CommandHandler<any, any>>[]): this;
    setQueryHandlers(queryHandlers: Resolver<QueryHandler<any, any>>[]): this;
    setEventSubscribers(eventSubscribers: Resolver<EventSubscriber<any>>[]): this;
    useRabbitMQ(url: string): this;
    useConsul(url: string): this;
    setCustom(props: CustomResolution): this;
    build(): {
        bootstrap: () => Promise<void>;
        listen: (port: number) => Promise<void>;
        getApp: () => Application;
        getContainer: () => AwilixContainer<any>;
    };
    listen(port: number): Promise<void>;
    private registerEventSubscribers;
    private registerCommonDependenciesIfNotSet;
}
export {};
