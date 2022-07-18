"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceBuilder = void 0;
const server_1 = require("../api/server");
const awilix_1 = require("awilix");
const opentracing = __importStar(require("opentracing"));
const __1 = require("..");
const container_1 = require("./container");
const logger_1 = require("./logger");
const message_bus_1 = require("./message-bus");
const tracer_1 = require("./tracer");
const service_discovery_1 = require("./service-discovery");
const redis_service_client_1 = require("./service-client/redis.service-client");
const token_provider_1 = require("./token-provider");
class ServiceBuilder {
    constructor() {
        this.container = (0, awilix_1.createContainer)();
    }
    setName(name) {
        this.serviceName = name;
        this.container.register({
            logger: (0, awilix_1.asValue)((0, logger_1.logger)(name)),
            serviceClient: (0, awilix_1.asClass)(redis_service_client_1.RedisServiceClient).singleton(),
            tokenProvider: (0, awilix_1.asClass)(token_provider_1.JwtTokenProviderService).singleton(),
        });
        const tracerBuilder = new tracer_1.TracerBuilder(name).build();
        opentracing.initGlobalTracer(tracerBuilder);
        const tracer = opentracing.globalTracer();
        this.container.register({
            tracer: (0, awilix_1.asValue)(tracer),
            tracingMiddleware: (0, awilix_1.asFunction)(__1.tracingMiddleware),
        });
        return this;
    }
    setControllers(controllers) {
        this.container.register({
            controllers: (0, container_1.registerAsArray)(controllers),
        });
        return this;
    }
    setServiceControllers(controllers) {
        this.container.register({
            serviceControllers: (0, container_1.registerAsArray)(controllers),
        });
        return this;
    }
    loadActions(actionPaths) {
        this.container.loadModules(actionPaths, {
            formatName: 'camelCase',
            resolverOptions: {
                lifetime: awilix_1.Lifetime.SCOPED,
                register: awilix_1.asFunction,
            },
        });
        return this;
    }
    setCommandHandlers(commandHandlers) {
        this.container.register({
            commandHandlers: (0, container_1.registerAsArray)(commandHandlers),
            commandBus: (0, awilix_1.asClass)(__1.InMemoryCommandBus).singleton(),
        });
        return this;
    }
    setQueryHandlers(queryHandlers) {
        this.container.register({
            queryHandlers: (0, container_1.registerAsArray)(queryHandlers),
            queryBus: (0, awilix_1.asClass)(__1.InMemoryQueryBus).singleton(),
        });
        return this;
    }
    setEventSubscribers(eventSubscribers) {
        if (!this.container.hasRegistration('messageBus')) {
            throw new Error("Can't subscribe to command. Message Bus is not set.");
        }
        this.container.register({
            subscribers: (0, container_1.registerAsArray)(eventSubscribers),
        });
        return this;
    }
    useRabbitMQ(url) {
        this.container.register({
            messageBus: (0, awilix_1.asClass)(message_bus_1.RabbitMqMessageBus)
                .inject(() => ({
                rabbitUrl: url,
                serviceName: this.serviceName,
            }))
                .singleton(),
        });
        return this;
    }
    useConsul(url) {
        this.container.register({
            serviceDiscovery: (0, awilix_1.asClass)(service_discovery_1.ConsulServiceDiscovery)
                .inject(() => ({
                consulUrl: url,
            }))
                .singleton(),
        });
        return this;
    }
    setCustom(props) {
        this.container.register(props);
        return this;
    }
    build() {
        return {
            bootstrap: async () => {
                var _a;
                const resolvedLogger = this.container.resolve('logger');
                const serviceClient = this.container.resolve('serviceClient');
                this.registerCommonDependenciesIfNotSet();
                await serviceClient.bootstrap();
                resolvedLogger.info('Loading service dependencies...');
                this.container.register({
                    server: (0, awilix_1.asClass)(server_1.Server).singleton(),
                });
                const messageBus = this.container.resolve('messageBus');
                await messageBus.init();
                this.registerEventSubscribers();
                const server = this.container.resolve('server');
                this.container.register({
                    app: (0, awilix_1.asValue)(server.getApp()),
                });
                let serviceControllers = [];
                if (this.container.hasRegistration('serviceControllers')) {
                    serviceControllers =
                        (_a = this.container.resolve('serviceControllers')) !== null && _a !== void 0 ? _a : [];
                }
                const controllerSetupPromises = serviceControllers.map((controller) => controller.setup());
                await Promise.all(controllerSetupPromises);
                resolvedLogger.info('Service bootstrapped successfully!');
            },
            listen: async (port) => this.listen(port),
            getApp: () => {
                const app = this.container.resolve('app');
                return app;
            },
            getContainer: () => {
                return this.container;
            },
        };
    }
    async listen(port) {
        const app = this.container.resolve('app');
        const serviceDiscovery = this.container.resolve('serviceDiscovery');
        const resolvedLogger = this.container.resolve('logger');
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
        app.listen(port, async () => {
            resolvedLogger.info(`Service started listening on http://localhost:${port}`, {
                port,
            });
        });
    }
    async registerEventSubscribers() {
        const subscribers = this.container.resolve('subscribers');
        const messageBus = this.container.resolve('messageBus');
        const promises = subscribers.map((subscriber) => {
            const [service, ...rest] = subscriber.type.split('.');
            return messageBus.subscribeToEvent(rest.join('.'), service, (event, ctx) => subscriber.handle(event, ctx));
        });
        await Promise.all(promises);
    }
    registerCommonDependenciesIfNotSet() {
        if (!this.container.hasRegistration('controllers')) {
            this.container.register({
                controllers: (0, container_1.registerAsArray)([]),
            });
        }
        if (!this.container.hasRegistration('commandHandlers')) {
            this.container.register({
                commandHandlers: (0, container_1.registerAsArray)([]),
            });
        }
        if (!this.container.hasRegistration('queryHandlers')) {
            this.container.register({
                queryHandlers: (0, container_1.registerAsArray)([]),
            });
        }
        if (!this.container.hasRegistration('subscribers')) {
            this.container.register({
                subscribers: (0, container_1.registerAsArray)([]),
            });
        }
    }
}
exports.ServiceBuilder = ServiceBuilder;
//# sourceMappingURL=service-builder.js.map