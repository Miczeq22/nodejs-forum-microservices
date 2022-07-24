import { RegisterNewAccountCommandHandler } from '@app/commands/register-new-account/register-new-account.command-handler';
import { InMemoryAccountEmailChecker } from '@infrastructure/account-email-checker/account-email-checker.service';
import { MessageBroker, ServiceBuilder } from '@myforum/building-blocks';
import { PasswordHashProviderImpl } from '@infrastructure/password-hash-provider/password-hash-provider.service';
import { asClass } from 'awilix';
import { PlatformRegistrationController } from '@api/platform-registration/platform-registration.controller';
import { InMemoryAccountRepository } from '@infrastructure/account/in-memory-account.repository';
import { InMemoryPlatformRegistrationRepository } from '@infrastructure/platform-registration/in-memory-platform-registration.repository';
import { RedisClientType } from 'redis';
import { LoginCommandHandler } from '@app/commands/login/login.command-handler';
import { PlatformAccessController } from '@api/platform-access/platform-access.controller';

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
    .setName('users')
    .useRedis('redis://127.0.0.1:6379')
    .useKafka()
    .build();

  await service.bootstrap();

  const port = 4500;

  await service.listen(port);

  const messageBroker = service.getContainer().resolve<MessageBroker>('messageBroker');

  const redis = service.getContainer().resolve<RedisClientType>('redisClient');

  service.cleanUpOnExit(async () => {
    await messageBroker.disconnect();

    await redis.disconnect();
  });
})();
