import { Author } from '../author/author.entity';

export interface AuthorProvider {
  getById(id: string): Promise<Author | null>;
}
