import { RawComment } from '@core/post-catalogue/comment/comment.types';
import { Post } from '@core/post-catalogue/post/post.aggregate-root';
import { PostRepository } from '@core/post-catalogue/post/post.repository';
import { RedisClientType } from 'redis';

interface Dependencies {
  redisClient: RedisClientType;
}

export class InMemoryPostCatalogueRepository implements PostRepository {
  private readonly CACHE_PREFIX = 'POSTS_';

  private readonly COMMENT_CACHE_PREFIX = 'COMMENTS_';

  constructor(private readonly dependencies: Dependencies) {}

  public async findById(id: string): Promise<Post> {
    const existingPost = await this.dependencies.redisClient.get(`${this.CACHE_PREFIX}${id}`);

    if (!existingPost) {
      return null;
    }

    return Post.fromPersistence({ id });
  }

  public async update(post: Post): Promise<void> {
    const { commentToAdd } = post.toJSON();

    if (commentToAdd) {
      await this.addNewComment(commentToAdd);
    }
  }

  private async addNewComment(comment: RawComment) {
    await this.dependencies.redisClient.set(
      `${this.COMMENT_CACHE_PREFIX}${comment.id}`,
      JSON.stringify(comment),
    );
  }
}
