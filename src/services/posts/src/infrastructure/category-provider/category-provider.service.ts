import { CategoryProvider } from '@core/shared-kernel/category-provider/category-provider.service';
import { Category } from '@core/shared-kernel/category/category.entity';
import { RawCategory } from '@core/shared-kernel/category/category.types';

export class InMemoryCategoryProvider implements CategoryProvider {
  private categories: RawCategory[] = [];

  public async getByName(name: string): Promise<Category> {
    let existingCategory = this.categories.find((category) => category.name === name);

    if (!existingCategory) {
      existingCategory = Category.createNew(name).toJSON();

      this.categories.push(existingCategory);
    }

    return Category.fromPersistence(existingCategory);
  }
}
