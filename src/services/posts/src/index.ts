import { MessageBroker, ServiceBuilder, EventSubscriber, Logger } from '@myforum/building-blocks';
import { asClass } from 'awilix';

interface Dependencies {
  logger: Logger;
}

class UserRegisteredSubscriber implements EventSubscriber<any> {
  public readonly type = 'UserRegisteredEvent';

  constructor(private readonly dependencies: Dependencies) {}

  public async handle(event: any): Promise<void> {
    this.dependencies.logger.info(`Received payload: ${JSON.stringify(event.payload)}`);
  }
}

(async () => {
  const service = new ServiceBuilder()
    .setName('posts')
    .setEventSubscribers([asClass(UserRegisteredSubscriber).singleton()])
    .useKafka()
    .build();

  await service.bootstrap();

  const port = Number(process.env.APP_PORT) || 4000;

  await service.listen(port);

  const messageBroker = service.getContainer().resolve<MessageBroker>('messageBroker');

  await messageBroker.subscribeToTopics(['users']);
})();
