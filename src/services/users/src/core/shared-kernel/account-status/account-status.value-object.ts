import { AccountStatusNotSupportedError } from '@core/errors/account-status-not-supported.error';
import { ValueObject } from '@myforum/building-blocks';
import { AccountStatusProps, AccountStatusValue } from './account-status.types';

export class AccountStatus extends ValueObject<AccountStatusProps> {
  private constructor(value: string) {
    super({
      value,
    });
  }

  public static AccountNotConfirmed = new AccountStatus(AccountStatusValue.AccountNotConfirmed);

  public static Active = new AccountStatus(AccountStatusValue.Active);

  public static Banned = new AccountStatus(AccountStatusValue.Banned);

  public static fromValue(value: string) {
    switch (value) {
      case AccountStatusValue.AccountNotConfirmed:
        return this.AccountNotConfirmed;

      case AccountStatusValue.Active:
        return this.Active;

      case AccountStatusValue.Banned:
        return this.Banned;

      default:
        throw new AccountStatusNotSupportedError();
    }
  }

  public getValue() {
    return this.props.value;
  }
}
