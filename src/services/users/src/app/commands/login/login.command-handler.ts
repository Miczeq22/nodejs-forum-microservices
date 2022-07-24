import { AccountRepository } from '@core/account/account.repository';
import { PasswordHashProvider } from '@core/shared-kernel/account-password/password-hash-provider.service';
import {
  CommandHandler,
  Logger,
  TokenProviderService,
  UnauthorizedError,
} from '@myforum/building-blocks';
import { LoginCommand } from './login.command';

interface Dependencies {
  logger: Logger;
  accountRepository: AccountRepository;
  passwordHashProvider: PasswordHashProvider;
  tokenProvider: TokenProviderService;
}

interface LoginCommandHandlerResponse {
  accessToken: string;
  refreshToken: string;
}

export class LoginCommandHandler
  implements CommandHandler<LoginCommand, LoginCommandHandlerResponse>
{
  constructor(private readonly dependencies: Dependencies) {}

  public async handle({
    payload: { email, password },
  }: LoginCommand): Promise<LoginCommandHandlerResponse> {
    const { accountRepository, passwordHashProvider, tokenProvider } = this.dependencies;

    const account = await accountRepository.findByEmail(email);

    if (!account) {
      throw new UnauthorizedError();
    }

    await account.login(password, {
      passwordHashProvider,
    });

    const accessToken = tokenProvider.generateToken(
      {
        accountId: account.getId().value,
      },
      '2d',
      '#secret',
    );

    const refreshToken = tokenProvider.generateToken(
      {
        accountId: account.getId().value,
      },
      '60d',
      `#secret.${account.getPasswordHash()}`,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
