import { Account } from '@core/account/account.aggregate-root';
import { AccountRepository } from '@core/account/account.repository';
import { RawAccount } from '@core/account/account.types';
import { RedisClientType } from 'redis';

interface Dependencies {
  redisClient: RedisClientType;
}

export class InMemoryAccountRepository implements AccountRepository {
  private readonly CACHE_PREFIX = 'USERS_';

  constructor(private readonly dependencies: Dependencies) {}

  public async findByEmail(email: string): Promise<Account | null> {
    const allKeys = await this.dependencies.redisClient.keys(`${this.CACHE_PREFIX}*`);

    const existingAccounts = allKeys.map((key) => this.dependencies.redisClient.get(key));

    const resolvedAccounts = (await Promise.all(existingAccounts)).map((account) =>
      JSON.parse(account),
    );

    const account = resolvedAccounts.find(
      (existingAccount: RawAccount) => existingAccount.email === email,
    );

    if (!account) {
      return null;
    }

    return Account.fromPersistence(account);
  }
}
