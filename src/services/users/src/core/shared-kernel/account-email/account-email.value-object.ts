import { ValueObject } from '@myforum/building-blocks';
import { AccountEmailDependencies, AccountEmailProps } from './account-email.types';
import { EmailFormatMustBeValidRule } from './rules/email-format-must-be-valid.rule';
import { EmailMustBeUniqueRule } from './rules/email-must-be-unique.rule';

export class AccountEmail extends ValueObject<AccountEmailProps> {
  private constructor(props: AccountEmailProps) {
    super(props);
  }

  public static async createNew(email: string, { accountEmailChecker }: AccountEmailDependencies) {
    AccountEmail.checkRule(new EmailFormatMustBeValidRule(email));
    await AccountEmail.checkRule(new EmailMustBeUniqueRule(email, accountEmailChecker));

    return this.convertEmailToParts(email);
  }

  private static convertEmailToParts(email: string) {
    const [localPart, domain] = email.split('@');

    return new AccountEmail({
      domain,
      localPart,
    });
  }

  public static fromPersistence(email: string) {
    return this.convertEmailToParts(email);
  }

  public toString() {
    return `${this.props.localPart}@${this.props.domain}`;
  }
}
