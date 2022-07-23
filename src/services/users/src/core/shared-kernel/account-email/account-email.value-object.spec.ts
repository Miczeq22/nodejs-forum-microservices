import { BusinessRuleValidationError, createMockProxy } from '@myforum/building-blocks';
import { AccountEmailChecker } from './account-email-checker.service';
import { AccountEmail } from './account-email.value-object';

describe('[Domain] Account Email Value Object', () => {
  const accountEmailChecker = createMockProxy<AccountEmailChecker>();

  beforeEach(() => {
    accountEmailChecker.mockClear();
  });

  test('should throw an error if email format is invalid', async () => {
    await expect(() =>
      AccountEmail.createNew('#invalid-format', {
        accountEmailChecker,
      }),
    ).rejects.toThrowError(BusinessRuleValidationError);
  });

  test('should throw an error if email is not unique', async () => {
    accountEmailChecker.isUnique.mockResolvedValue(false);

    await expect(() =>
      AccountEmail.createNew('john@doe.com', {
        accountEmailChecker,
      }),
    ).rejects.toThrowError(BusinessRuleValidationError);
  });

  test('should create new account email', async () => {
    accountEmailChecker.isUnique.mockResolvedValue(true);

    const accountEmail = await AccountEmail.createNew('john@doe.com', {
      accountEmailChecker,
    });

    expect(accountEmail.toString()).toEqual('john@doe.com');
  });
});
