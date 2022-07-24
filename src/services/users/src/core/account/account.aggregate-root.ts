import { AccountEmail } from '@core/shared-kernel/account-email/account-email.value-object';
import { AccountPassword } from '@core/shared-kernel/account-password/account-password.value-object';
import { PasswordHashProvider } from '@core/shared-kernel/account-password/password-hash-provider.service';
import { AccountStatus } from '@core/shared-kernel/account-status/account-status.value-object';
import { AggregateRoot, UnauthorizedError, UniqueEntityID } from '@myforum/building-blocks';
import { AccountProps, RawAccount } from './account.types';
import { PasswordsMustMatchRule } from './rules/passwords-must-match.rule';

interface Dependencies {
  passwordHashProvider: PasswordHashProvider;
}

export class Account extends AggregateRoot<AccountProps> {
  private constructor(props: AccountProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static fromPersistence({ id, email, password, status }: RawAccount) {
    return new Account(
      {
        email: AccountEmail.fromPersistence(email),
        password: AccountPassword.fromHash(password),
        status: AccountStatus.fromValue(status),
      },
      new UniqueEntityID(id),
    );
  }

  public async login(plainPassword: string, { passwordHashProvider }: Dependencies) {
    await Account.checkRule(
      new PasswordsMustMatchRule(this.props.password, plainPassword, passwordHashProvider),
      UnauthorizedError,
    );
  }

  public getId() {
    return this.id;
  }

  public getPasswordHash() {
    return this.props.password.getHash();
  }
}
