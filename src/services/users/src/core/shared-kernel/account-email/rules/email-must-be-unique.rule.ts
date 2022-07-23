import { BusinessRule } from '@myforum/building-blocks';
import { AccountEmailChecker } from '../account-email-checker.service';

export class EmailMustBeUniqueRule implements BusinessRule {
  public readonly message = 'Provided email is already taken.';

  constructor(
    private readonly email: string,
    private readonly accountEmailChecker: AccountEmailChecker,
  ) {}

  public async isBroken(): Promise<boolean> {
    return !(await this.accountEmailChecker.isUnique(this.email));
  }
}
