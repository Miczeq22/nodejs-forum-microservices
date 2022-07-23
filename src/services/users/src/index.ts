import { RegisterNewAccountCommandHandler } from '@app/commands/register-new-account/register-new-account.command-handler';
import { InMemoryAccountEmailChecker } from '@infrastructure/account-email-checker/account-email-checker.service';
import { MessageBroker, ServiceBuilder } from '@myforum/building-blocks';
import { PasswordHashProviderImpl } from '@infrastructure/password-hash-provider/password-hash-provider.service';
import { asClass } from 'awilix';
import { PlatformRegistrationController } from '@api/platform-registration/platform-registration.controller';

(async () => {
  const service = new ServiceBuilder()
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setCustom({
      accountEmailChecker: asClass(InMemoryAccountEmailChecker).singleton(),
      passwordHashProvider: asClass(PasswordHashProviderImpl).singleton(),
    })
    .setCommandHandlers([asClass(RegisterNewAccountCommandHandler).singleton()])
    .setControllers([asClass(PlatformRegistrationController).singleton()])
    .setName('users')
    .useKafka()
    .build();

  await service.bootstrap();

  const port = 4500;

  await service.listen(port);

  const messageBroker = service.getContainer().resolve<MessageBroker>('messageBroker');

  service.cleanUpOnExit(async () => {
    await messageBroker.disconnect();
  });
})();
