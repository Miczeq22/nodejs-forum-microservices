import { DocsController } from '@api/docs.controller';
import { ServiceBuilder } from '@myforum/building-blocks';
import { asClass } from 'awilix';
import { config } from 'dotenv';

config({
  path: '../../.env',
});

(async () => {
  const service = new ServiceBuilder()
    .setName('api-gateway')
    .setControllers([asClass(DocsController).singleton()])
    .build();

  const port = Number(process.env.APP_PORT) || 7500;

  await service.bootstrap();

  await service.listen(port);
})();
