import { RegisterServicePayload, ServiceDiscovery } from './service-discovery';
interface Dependencies {
    consulUrl: string;
}
export declare class ConsulServiceDiscovery implements ServiceDiscovery {
    private readonly dependencies;
    constructor(dependencies: Dependencies);
    registerService({ address, name, port, health, }: RegisterServicePayload): Promise<void>;
    deregisterService(serviceId: string): Promise<void>;
}
export {};
