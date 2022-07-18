"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsulServiceDiscovery = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const crypto_1 = __importDefault(require("crypto"));
const my_forum_error_1 = require("../../errors/my-forum.error");
class ConsulServiceDiscovery {
    constructor(dependencies) {
        this.dependencies = dependencies;
    }
    async registerService({ address, name, port, health, }) {
        const id = crypto_1.default.randomBytes(16).toString('hex');
        const catalogResponse = await (0, node_fetch_1.default)(`${this.dependencies.consulUrl}/v1/catalog/service/${name}-ms`);
        const catalogData = await catalogResponse.json();
        const existingService = catalogData.find((service) => service.ServicePort === port);
        if (existingService) {
            this.deregisterService(existingService.ServiceID);
        }
        const res = await (0, node_fetch_1.default)(`${this.dependencies.consulUrl}/v1/agent/service/register`, {
            method: 'PUT',
            body: JSON.stringify({
                Id: `${name}-ms-${id}`,
                Name: `${name}-ms`,
                Address: address,
                Port: port,
                Tags: [`urlprefix-/${name} strip=/${name}`],
                ...(health && {
                    Check: {
                        HTTP: `http://host.docker.internal:${port}${health.endpoint}`,
                        Interval: `${health.intervalSeconds || 15}s`,
                        Timeout: `${health.timeoutSeconds || 10}s`,
                        DeregisterCriticalServiceAfter: '1m',
                    },
                }),
            }),
        });
        if (res.status !== 200) {
            throw new my_forum_error_1.MyForumError(`Can't connect ${name} service with Consul.`);
        }
    }
    async deregisterService(serviceId) {
        await (0, node_fetch_1.default)(`${this.dependencies.consulUrl}/v1/agent/service/deregister/${serviceId}`, {
            method: 'PUT',
        });
    }
}
exports.ConsulServiceDiscovery = ConsulServiceDiscovery;
//# sourceMappingURL=consul.service-discovery.js.map