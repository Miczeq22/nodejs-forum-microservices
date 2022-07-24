import { AccountEmail } from '@core/shared-kernel/account-email/account-email.value-object';
import { AccountPassword } from '@core/shared-kernel/account-password/account-password.value-object';
import { AccountStatus } from '@core/shared-kernel/account-status/account-status.value-object';

export interface AccountProps {
  email: AccountEmail;
  password: AccountPassword;
  status: AccountStatus;
}

export interface RawAccount {
  id: string;
  email: string;
  password: string;
  status: string;
}
