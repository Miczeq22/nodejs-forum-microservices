import { Author } from '@core/shared-kernel/author/author.entity';
import { RawAuthor } from '@core/shared-kernel/author/author.types';
import { Category } from '@core/shared-kernel/category/category.entity';
import { RawCategory } from '@core/shared-kernel/category/category.types';

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

export interface RawPost {
  id: string;
  title: string;
  content: string;
  author: RawAuthor;
  status: string;
  category: RawCategory;
  createdAt: string;
  updatedAt: string | null;
}
