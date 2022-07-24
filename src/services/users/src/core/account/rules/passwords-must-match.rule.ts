import { AccountPassword } from '@core/shared-kernel/account-password/account-password.value-object';
import { PasswordHashProvider } from '@core/shared-kernel/account-password/password-hash-provider.service';
import { BusinessRule } from '@myforum/building-blocks';

export class PasswordsMustMatchRule implements BusinessRule {
  public readonly message = 'Unauthorized.';

  constructor(
    private readonly password: AccountPassword,
    private readonly plainPassword: string,
    private readonly passwordHashProvider: PasswordHashProvider,
  ) {}

  public async isBroken(): Promise<boolean> {
    return !(await this.passwordHashProvider.isValidPassword(
      this.plainPassword,
      this.password.getHash(),
    ));
  }
}
