import { ServiceBuilder } from '@myforum/building-blocks';

(async () => {
  const service = new ServiceBuilder().setName('posts').build();

  await service.bootstrap();

  const port = Number(process.env.APP_PORT) || 4000;

  await service.listen(port);
})();
