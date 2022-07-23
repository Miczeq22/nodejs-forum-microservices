import { AccountEmailChecker } from './account-email-checker.service';

export interface AccountEmailProps {
  localPart: string;
  domain: string;
}

export interface AccountEmailDependencies {
  accountEmailChecker: AccountEmailChecker;
}
