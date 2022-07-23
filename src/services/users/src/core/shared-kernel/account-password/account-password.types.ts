import { PasswordHashProvider } from './password-hash-provider.service';

export interface AccountPasswordProps {
  passwordHash: string;
}

export interface AccountPasswordDependencies {
  passwordHashProvider: PasswordHashProvider;
}
