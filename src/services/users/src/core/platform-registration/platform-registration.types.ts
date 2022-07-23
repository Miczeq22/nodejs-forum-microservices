import { AccountEmail } from '@core/shared-kernel/account-email/account-email.value-object';
import { AccountPassword } from '@core/shared-kernel/account-password/account-password.value-object';
import { AccountStatus } from '@core/shared-kernel/account-status/account-status.value-object';

export interface PlatformRegistrationProps {
  email: AccountEmail;
  password: AccountPassword;
  status: AccountStatus;
  registeredAt: Date;
  accountConfirmedAt: Date | null;
}

export interface RegisterNewAccountPayload {
  email: string;
  password: string;
}
