import { Post } from './post.aggregate-root';

export interface PostRepository {
  findById(id: string): Promise<Post | null>;

  update(post: Post): Promise<void>;
}
