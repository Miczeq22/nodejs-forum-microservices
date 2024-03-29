import { PostCatalogueController } from '@api/post-catalogue/post-catalogue.controller';
import { PostsManagementController } from '@api/posts-management/posts-management.controller';
import { CreateNewPostCommandHandler } from '@app/commands/create-new-post/create-new-post.command-handler';
import { GetAllPostsQueryHandler } from '@app/queries/get-all-posts/get-all-posts.query-handler';
import { NewAccountRegisteredSubscriber } from '@app/subscribers/users/new-account-registered/new-account-registered.subscriber';
import { InMemoryAuthorProvider } from '@infrastructure/author-provider/author-provider.service';
import { InMemoryCategoryProvider } from '@infrastructure/category-provider/category-provider.service';
import { InMemoryPostRepository } from '@infrastructure/post/post.repository';
import { MessageBroker, ServiceBuilder } from '@myforum/building-blocks';
import { asClass } from 'awilix';
import path from 'path';
import { RedisClientType } from 'redis';
import { config } from 'dotenv';
import { GetSinglePostQueryHandler } from '@app/queries/get-single-post/get-single-post.query-handler';
import { InMemoryPostCatalogueRepository } from '@infrastructure/post-catalogue/post/post.repository';
import { AddNewCommentCommandHandler } from '@app/commands/add-new-comment/add-new-comment.command-handler';

config({
  path: '../../../.env',
});

(async () => {
  const service = new ServiceBuilder()
    .setName('posts', process.env.JAEGER_ENDPOINT)
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setEventSubscribers([asClass(NewAccountRegisteredSubscriber).singleton()])
    .setCommandHandlers([
      asClass(CreateNewPostCommandHandler).singleton(),
      asClass(AddNewCommentCommandHandler).singleton(),
    ])
    .setQueryHandlers([
      asClass(GetAllPostsQueryHandler).singleton(),
      asClass(GetSinglePostQueryHandler).singleton(),
    ])
    .setControllers([
      asClass(PostsManagementController).singleton(),
      asClass(PostCatalogueController).singleton(),
    ])
    .setCustom({
      authorProvider: asClass(InMemoryAuthorProvider).singleton(),
      categoryProvider: asClass(InMemoryCategoryProvider).singleton(),
      postRepository: asClass(InMemoryPostRepository).singleton(),
      postCatalogueRepository: asClass(InMemoryPostCatalogueRepository).singleton(),
    })
    .useKafka(process.env.KAFKA_URL)
    .useRedis(process.env.REDIS_URL)
    .useOpenApi([
      path.join(__dirname, 'api', '**', '*.action.ts'),
      path.join(__dirname, 'api', '**', '*.action.js'),
      path.join(__dirname, 'api', '**', '*.schema.ts'),
      path.join(__dirname, 'api', '**', '*.schema.js'),
    ])
    .build();

  await service.bootstrap();

  const port = Number(process.env.POSTS_APP_PORT) || 4000;

  await service.listen(port);

  const messageBroker = service.getContainer().resolve<MessageBroker>('messageBroker');

  await messageBroker.subscribeToTopics(['users']);

  const redis = service.getContainer().resolve<RedisClientType>('redisClient');

  service.cleanUpOnExit(async () => {
    await messageBroker.disconnect();
    await redis.disconnect();
  });
})();
