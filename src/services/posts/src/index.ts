import { PostsManagementController } from '@api/posts-management/posts-management.controller';
import { CreateNewPostCommandHandler } from '@app/commands/create-new-post/create-new-post.command-handler';
import { InMemoryAuthorProvider } from '@infrastructure/author-provider/author-provider.service';
import { InMemoryCategoryProvider } from '@infrastructure/category-provider/category-provider.service';
import { InMemoryPostRepository } from '@infrastructure/post/post.repository';
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
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setEventSubscribers([asClass(UserRegisteredSubscriber).singleton()])
    .setCommandHandlers([asClass(CreateNewPostCommandHandler).singleton()])
    .setControllers([asClass(PostsManagementController).singleton()])
    .setCustom({
      authorProvider: asClass(InMemoryAuthorProvider).singleton(),
      categoryProvider: asClass(InMemoryCategoryProvider).singleton(),
      postRepository: asClass(InMemoryPostRepository).singleton(),
    })
    .useKafka()
    .build();

  await service.bootstrap();

  const port = Number(process.env.APP_PORT) || 4000;

  await service.listen(port);

  const messageBroker = service.getContainer().resolve<MessageBroker>('messageBroker');

  await messageBroker.subscribeToTopics(['users']);
})();
