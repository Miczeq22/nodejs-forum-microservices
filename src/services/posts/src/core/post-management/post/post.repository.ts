import { Post } from './post.aggregate-root';

export interface PostRepository {
  insert(post: Post): Promise<void>;

  findById(id: string): Promise<Post | null>;
}
