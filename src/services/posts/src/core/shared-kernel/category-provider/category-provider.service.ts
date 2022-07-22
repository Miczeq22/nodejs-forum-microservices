import { Category } from '../category/category.entity';

export interface CategoryProvider {
  getByName(name: string): Promise<Category>;
}
