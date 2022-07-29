import { DocsController } from '@api/docs.controller';
import { ProxyController } from '@api/proxy.controller';
import { ServiceBuilder } from '@myforum/building-blocks';
import { asClass } from 'awilix';
import { config } from 'dotenv';

config({
  path: '../../.env',
});

(async () => {
  const service = new ServiceBuilder()
    .setName('api-gateway', process.env.JAEGER_ENDPOINT)
    .setControllers([asClass(DocsController).singleton(), asClass(ProxyController).singleton()])
    .build();

  const port = Number(process.env.API_GATEWAY_APP_PORT) || 7500;

  await service.bootstrap();

  await service.listen(port);
})();
