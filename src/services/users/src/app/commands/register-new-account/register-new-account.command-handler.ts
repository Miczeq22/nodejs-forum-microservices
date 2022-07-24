import { PlatformRegistration } from '@core/platform-registration/platform-registration.aggregate-root';
import { PlatformRegistrationRepository } from '@core/platform-registration/platform-registration.repository';
import { AccountEmailChecker } from '@core/shared-kernel/account-email/account-email-checker.service';
import { PasswordHashProvider } from '@core/shared-kernel/account-password/password-hash-provider.service';
import { CommandHandler, MessageBroker } from '@myforum/building-blocks';
import { RegisterNewAccountCommand } from './register-new-account.command';

interface Dependencies {
  accountEmailChecker: AccountEmailChecker;
  passwordHashProvider: PasswordHashProvider;
  messageBroker: MessageBroker;
  platformRegistrationRepository: PlatformRegistrationRepository;
}

export class RegisterNewAccountCommandHandler implements CommandHandler<RegisterNewAccountCommand> {
  constructor(private readonly dependencies: Dependencies) {}

  public async handle({ payload }: RegisterNewAccountCommand): Promise<void> {
    const {
      accountEmailChecker,
      passwordHashProvider,
      messageBroker,
      platformRegistrationRepository,
    } = this.dependencies;

    const account = await PlatformRegistration.registerNewAccount(payload, {
      accountEmailChecker,
      passwordHashProvider,
    });

    await platformRegistrationRepository.insert(account);

    const eventsToDispatchPromises = account
      .getDomainEvents()
      .map((event) => messageBroker.sendMessage('users', event, account.getId().value));

    await Promise.all(eventsToDispatchPromises);
  }
}
