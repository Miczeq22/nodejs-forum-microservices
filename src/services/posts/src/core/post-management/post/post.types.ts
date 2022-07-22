import { Author } from '@core/shared-kernel/author/author.entity';
import { Category } from '@core/shared-kernel/category/category.entity';

export interface PostProps {
  title: string;
  content: string;
  author: Author;
  status: string;
  category: Category;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface CreateNewPostPayload {
  authorId: string;
  title: string;
  content: string;
  category: string;
}
