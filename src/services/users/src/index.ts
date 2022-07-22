import { DomainEvent, ServiceBuilder, MessageBroker } from '@myforum/building-blocks';

interface Payload {
  id: number;
  name: string;
}

class UserRegisteredEvent extends DomainEvent<Payload> {}

(async () => {
  const service = new ServiceBuilder().setName('users').useKafka().build();

  await service.bootstrap();

  const port = 4500;

  await service.listen(port);

  const messageBroker = service.getContainer().resolve<MessageBroker>('messageBroker');

  await messageBroker.sendMessage(
    'users',
    new UserRegisteredEvent({
      id: 1,
      name: `John ${new Date().getTime()}`,
    }),
    '1',
  );
})();
