import { Entity, UniqueEntityID } from '@myforum/building-blocks';
import { CategoryProps, PersistedCategory } from './category.types';

export class Category extends Entity<CategoryProps> {
  private constructor(props: CategoryProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static fromPersistence({ id, name }: PersistedCategory) {
    return new Category(
      {
        name,
      },
      new UniqueEntityID(id),
    );
  }
}
