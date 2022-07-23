import { AccountEmailChecker } from '@core/shared-kernel/account-email/account-email-checker.service';

export class InMemoryAccountEmailChecker implements AccountEmailChecker {
  public async isUnique(): Promise<boolean> {
    return true;
  }
}
