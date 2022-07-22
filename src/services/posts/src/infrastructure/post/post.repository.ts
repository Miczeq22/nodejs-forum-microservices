import { Post } from '@core/post-management/post/post.aggregate-root';
import { PostRepository } from '@core/post-management/post/post.repository';
import { RawPost } from '@core/post-management/post/post.types';

export class InMemoryPostRepository implements PostRepository {
  private posts: RawPost[] = [];

  public async insert(post: Post): Promise<void> {
    this.posts.push(post.toJSON());
  }

  public async findById(id: string): Promise<Post> {
    const existingPost = this.posts.find((post) => post.id === id);

    if (!existingPost) {
      return null;
    }

    return Post.fromPersistence(existingPost);
  }
}
