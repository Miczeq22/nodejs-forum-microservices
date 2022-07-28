import { NewAccountRegisteredSubscriber } from '@app/subscribers/users/new-account-registered/new-account-registered.subscriber';
import { InMemoryMailer } from '@infrastructure/mailer/in-memory/in-memory-mailer.service';
import { MessageBroker, ServiceBuilder } from '@myforum/building-blocks';
import { asClass } from 'awilix';
import { config } from 'dotenv';

config({
  path: '../../../.env',
});

(async () => {
  const service = new ServiceBuilder()
    .setName('notifications', process.env.JAEGER_ENDPOINT)
    .setCustom({
      mailer: asClass(InMemoryMailer).singleton(),
    })
    .setEventSubscribers([asClass(NewAccountRegisteredSubscriber).singleton()])
    .useKafka(process.env.KAFKA_URL)
    .useRedis(process.env.REDIS_URL)
    .build();

  await service.bootstrap();

  const port = Number(process.env.NOTIFICATIONS_APP_PORT) || 5300;

  await service.listen(port);

  const messageBroker = service.getContainer().resolve<MessageBroker>('messageBroker');

  await messageBroker.subscribeToTopics(['users']);

  service.cleanUpOnExit(async () => {
    await messageBroker.disconnect();
  });
})();
