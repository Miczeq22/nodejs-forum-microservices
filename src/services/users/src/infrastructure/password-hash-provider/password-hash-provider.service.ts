import { PasswordHashProvider } from '@core/shared-kernel/account-password/password-hash-provider.service';
import bcrypt from 'bcrypt';

export class PasswordHashProviderImpl implements PasswordHashProvider {
  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public async isValidPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
