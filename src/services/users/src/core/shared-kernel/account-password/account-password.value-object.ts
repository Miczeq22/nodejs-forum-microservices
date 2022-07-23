import { UnauthorizedError, ValueObject } from '@myforum/building-blocks';
import { AccountPasswordDependencies, AccountPasswordProps } from './account-password.types';
import { OldPasswordMustMatchRule } from './rules/old-password-must-match.rule';
import { PasswordMustBeStrongRule } from './rules/password-must-be-strong.rule';

export class AccountPassword extends ValueObject<AccountPasswordProps> {
  private constructor(passwordHash: string) {
    super({
      passwordHash,
    });
  }

  public static async createNew(
    password: string,
    { passwordHashProvider }: AccountPasswordDependencies,
  ) {
    AccountPassword.checkRule(new PasswordMustBeStrongRule(password));

    const passwordHash = await passwordHashProvider.hashPassword(password);

    return new AccountPassword(passwordHash);
  }

  public static fromHash(passwordHash: string) {
    return new AccountPassword(passwordHash);
  }

  public async updatePassword(
    oldPassword: string,
    newPassword: string,
    { passwordHashProvider }: AccountPasswordDependencies,
  ) {
    await AccountPassword.checkRule(
      new OldPasswordMustMatchRule(oldPassword, this.props.passwordHash, passwordHashProvider),
      UnauthorizedError,
    );
    AccountPassword.checkRule(new PasswordMustBeStrongRule(newPassword));

    const passwordHash = await passwordHashProvider.hashPassword(newPassword);

    return new AccountPassword(passwordHash);
  }

  public getHash() {
    return this.props.passwordHash;
  }
}
