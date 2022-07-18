import fetch from 'node-fetch';
import crypto from 'crypto';
import { MyForumError } from '@errors/my-forum.error';
import { RegisterServicePayload, ServiceDiscovery } from './service-discovery';

interface Dependencies {
  consulUrl: string;
}

export class ConsulServiceDiscovery implements ServiceDiscovery {
  constructor(private readonly dependencies: Dependencies) {}

  public async registerService({
    address,
    name,
    port,
    health,
  }: RegisterServicePayload): Promise<void> {
    const id = crypto.randomBytes(16).toString('hex');

    const catalogResponse = await fetch(
      `${this.dependencies.consulUrl}/v1/catalog/service/${name}-ms`,
    );

    const catalogData = await catalogResponse.json();

    const existingService = catalogData.find((service) => service.ServicePort === port);

    if (existingService) {
      this.deregisterService(existingService.ServiceID);
    }

    const res = await fetch(`${this.dependencies.consulUrl}/v1/agent/service/register`, {
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
      throw new MyForumError(`Can't connect ${name} service with Consul.`);
    }
  }

  public async deregisterService(serviceId: string): Promise<void> {
    await fetch(`${this.dependencies.consulUrl}/v1/agent/service/deregister/${serviceId}`, {
      method: 'PUT',
    });
  }
}
