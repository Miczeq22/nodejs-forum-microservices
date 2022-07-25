import { AuthorProvider } from '@core/shared-kernel/author-provider/author-provider.service';
import { Author } from '@core/shared-kernel/author/author.entity';
import { RedisClientType } from 'redis';

interface Dependencies {
  redisClient: RedisClientType;
}

export class InMemoryAuthorProvider implements AuthorProvider {
  private readonly CACHE_PREFIX = 'USERS_';

  constructor(private readonly dependencies: Dependencies) {}

  public async getById(id: string): Promise<Author> {
    const { redisClient } = this.dependencies;

    const existingAuthor = await redisClient.get(`${this.CACHE_PREFIX}${id}`);

    if (!existingAuthor) {
      return null;
    }

    return Author.fromPersistence(JSON.parse(existingAuthor));
  }
}
