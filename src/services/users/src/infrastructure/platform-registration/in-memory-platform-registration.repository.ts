import { PlatformRegistration } from '@core/platform-registration/platform-registration.aggregate-root';
import { PlatformRegistrationRepository } from '@core/platform-registration/platform-registration.repository';
import { RedisClientType } from 'redis';

interface Dependencies {
  redisClient: RedisClientType;
}

export class InMemoryPlatformRegistrationRepository implements PlatformRegistrationRepository {
  private readonly CACHE_PREFIX = 'USERS_';

  constructor(private readonly dependencies: Dependencies) {}

  public async insert(platformRegistration: PlatformRegistration): Promise<void> {
    const { id, ...data } = platformRegistration.toJSON();

    await this.dependencies.redisClient.set(
      `${this.CACHE_PREFIX}${id}`,
      JSON.stringify({
        ...data,
        id,
      }),
    );
  }
}
