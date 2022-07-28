import { RegisterNewAccountCommandHandler } from '@app/commands/register-new-account/register-new-account.command-handler';
import { InMemoryAccountEmailChecker } from '@infrastructure/account-email-checker/account-email-checker.service';
import { MessageBroker, ServiceBuilder } from '@myforum/building-blocks';
import { PasswordHashProviderImpl } from '@infrastructure/password-hash-provider/password-hash-provider.service';
import { asClass } from 'awilix';
import path from 'path';
import { PlatformRegistrationController } from '@api/platform-registration/platform-registration.controller';
import { InMemoryAccountRepository } from '@infrastructure/account/in-memory-account.repository';
import { InMemoryPlatformRegistrationRepository } from '@infrastructure/platform-registration/in-memory-platform-registration.repository';
import { RedisClientType } from 'redis';
import { LoginCommandHandler } from '@app/commands/login/login.command-handler';
import { PlatformAccessController } from '@api/platform-access/platform-access.controller';
import { config } from 'dotenv';

config({
  path: '../../../.env',
});

(async () => {
  const service = new ServiceBuilder()
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setCustom({
      accountEmailChecker: asClass(InMemoryAccountEmailChecker).singleton(),
      passwordHashProvider: asClass(PasswordHashProviderImpl).singleton(),
      accountRepository: asClass(InMemoryAccountRepository).singleton(),
      platformRegistrationRepository: asClass(InMemoryPlatformRegistrationRepository).singleton(),
    })
    .setCommandHandlers([
      asClass(RegisterNewAccountCommandHandler).singleton(),
      asClass(LoginCommandHandler).singleton(),
    ])
    .setControllers([
      asClass(PlatformRegistrationController).singleton(),
      asClass(PlatformAccessController).singleton(),
    ])
    .setName('users', process.env.JAEGER_ENDPOINT)
    .useRedis(process.env.REDIS_URL)
    .useKafka(process.env.KAFKA_URL)
    .useOpenApi([
      path.join(__dirname, 'api', '**', '*.action.ts'),
      path.join(__dirname, 'api', '**', '*.action.js'),
      path.join(__dirname, 'api', '**', '*.schema.ts'),
      path.join(__dirname, 'api', '**', '*.schema.js'),
    ])
    .build();

  await service.bootstrap();

  const port = Number(process.env.USERS_APP_PORT) || 4000;

  await service.listen(port);

  const messageBroker = service.getContainer().resolve<MessageBroker>('messageBroker');

  const redis = service.getContainer().resolve<RedisClientType>('redisClient');

  service.cleanUpOnExit(async () => {
    await messageBroker.disconnect();

    await redis.disconnect();
  });
})();
