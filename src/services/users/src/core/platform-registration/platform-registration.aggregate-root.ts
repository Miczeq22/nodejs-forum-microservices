import { AccountEmailChecker } from '@core/shared-kernel/account-email/account-email-checker.service';
import { AccountEmail } from '@core/shared-kernel/account-email/account-email.value-object';
import { AccountPassword } from '@core/shared-kernel/account-password/account-password.value-object';
import { PasswordHashProvider } from '@core/shared-kernel/account-password/password-hash-provider.service';
import { AccountStatus } from '@core/shared-kernel/account-status/account-status.value-object';
import { AggregateRoot, UniqueEntityID } from '@myforum/building-blocks';
import { NewAccountRegisteredEvent } from './events/new-account-registered.event';
import {
  PlatformRegistrationProps,
  RegisterNewAccountPayload,
} from './platform-registration.types';

interface Dependencies {
  accountEmailChecker: AccountEmailChecker;
  passwordHashProvider: PasswordHashProvider;
}

export class PlatformRegistration extends AggregateRoot<PlatformRegistrationProps> {
  private constructor(props: PlatformRegistrationProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static async registerNewAccount(
    { email, password }: RegisterNewAccountPayload,
    { accountEmailChecker, passwordHashProvider }: Dependencies,
  ) {
    const platformRegistration = new PlatformRegistration({
      email: await AccountEmail.createNew(email, {
        accountEmailChecker,
      }),
      password: await AccountPassword.createNew(password, {
        passwordHashProvider,
      }),
      // TODO: Set to non-active when e-mail confirmation is ready
      status: AccountStatus.Active,
      registeredAt: new Date(),
      accountConfirmedAt: null,
    });

    platformRegistration.addDomainEvent(
      new NewAccountRegisteredEvent({
        accountId: platformRegistration.id.value,
        accountEmail: platformRegistration.props.email.toString(),
      }),
    );

    return platformRegistration;
  }

  public getId() {
    return this.id;
  }

  public getPasswordHash() {
    return this.props.password.getHash();
  }

  public toJSON() {
    return {
      id: this.id.value,
      email: this.props.email.toString(),
      password: this.props.password.getHash(),
      status: this.props.status.getValue(),
      registeredAt: this.props.registeredAt.toISOString(),
      accountConfirmedAt: this.props.accountConfirmedAt
        ? this.props.accountConfirmedAt.toISOString()
        : null,
    };
  }
}
