import { AccountStatusNotSupportedError } from '@core/errors/account-status-not-supported.error';
import { AccountStatusValue } from './account-status.types';
import { AccountStatus } from './account-status.value-object';

describe('[Domain] Account Status Value Object', () => {
  test('should create WaitingForEmailConfirmation status', () => {
    const status = AccountStatus.WaitingForEmailConfirmation;

    expect(status.getValue()).toEqual(AccountStatusValue.WaitingForEmailConfirmation);
  });

  test('should create EmailConfirmed status', () => {
    const status = AccountStatus.EmailConfirmed;

    expect(status.getValue()).toEqual(AccountStatusValue.EmailConfirmed);
  });

  test('should create Expired status', () => {
    const status = AccountStatus.Expired;

    expect(status.getValue()).toEqual(AccountStatusValue.Expired);
  });

  test('should create status from string value', () => {
    const status = AccountStatus.fromValue('Expired');

    expect(status.equals(AccountStatus.Expired)).toBeTruthy();
  });

  test('should throw an error if status is not supported', () => {
    expect(() => AccountStatus.fromValue('#not-supported')).toThrowError(
      AccountStatusNotSupportedError,
    );
  });
});
