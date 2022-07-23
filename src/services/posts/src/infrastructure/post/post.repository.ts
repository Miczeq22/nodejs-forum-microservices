import { Post } from '@core/post-management/post/post.aggregate-root';
import { PostRepository } from '@core/post-management/post/post.repository';
import { RedisClientType } from 'redis';

interface Dependencies {
  redisClient: RedisClientType;
}

export class InMemoryPostRepository implements PostRepository {
  private readonly CACHE_PREFIX = 'POSTS_';

  constructor(private readonly dependencies: Dependencies) {}

  public async insert(post: Post): Promise<void> {
    const { id, ...data } = post.toJSON();

    await this.dependencies.redisClient.set(
      `${this.CACHE_PREFIX}${id}`,
      JSON.stringify({
        ...data,
        id,
      }),
      {},
    );
  }

  public async findById(id: string): Promise<Post> {
    const existingPost = await this.dependencies.redisClient.get(`${this.CACHE_PREFIX}${id}`);

    if (!existingPost) {
      return null;
    }

    return Post.fromPersistence(JSON.parse(existingPost));
  }

  public async findAll(): Promise<Post[]> {
    const allKeys = await this.dependencies.redisClient.keys(`${this.CACHE_PREFIX}*`);

    const existingPosts = allKeys.map((key) => this.dependencies.redisClient.get(key));

    const resolvedPosts = await Promise.all(existingPosts);

    return resolvedPosts
      .filter(Boolean)
      .map((post) => JSON.parse(post))
      .map(Post.fromPersistence);
  }
}
