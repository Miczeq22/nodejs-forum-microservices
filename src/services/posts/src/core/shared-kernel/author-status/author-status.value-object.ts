import { AccountStatusNotSupportedError } from '@core/errors/account-status-not-supported.error';
import { ValueObject } from '@myforum/building-blocks';
import { AuthorStatusProps, AuthorStatusValue } from './author-status.types';

export class AuthorStatus extends ValueObject<AuthorStatusProps> {
  private constructor(value: string) {
    super({
      value,
    });
  }

  public static AccountNotConfirmed = new AuthorStatus(AuthorStatusValue.AccountNotConfirmed);

  public static Active = new AuthorStatus(AuthorStatusValue.Active);

  public static Banned = new AuthorStatus(AuthorStatusValue.Banned);

  public static fromValue(value: string) {
    switch (value) {
      case AuthorStatusValue.Active:
        return this.Active;

      case AuthorStatusValue.AccountNotConfirmed:
        return this.AccountNotConfirmed;

      case AuthorStatusValue.Banned:
        return this.Banned;
      default:
        throw new AccountStatusNotSupportedError();
    }
  }

  public getValue() {
    return this.props.value;
  }
}
