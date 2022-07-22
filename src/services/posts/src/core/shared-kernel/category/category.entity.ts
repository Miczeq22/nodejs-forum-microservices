import { Entity, UniqueEntityID } from '@myforum/building-blocks';
import { CategoryProps, RawCategory } from './category.types';

export class Category extends Entity<CategoryProps> {
  private constructor(props: CategoryProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static createNew(name: string) {
    // TODO: name must be valid
    return new Category({
      name,
    });
  }

  public static fromPersistence({ id, name }: RawCategory) {
    return new Category(
      {
        name,
      },
      new UniqueEntityID(id),
    );
  }

  public getName() {
    return this.props.name;
  }

  public toJSON(): RawCategory {
    return {
      id: this.id.value,
      name: this.props.name,
    };
  }
}
