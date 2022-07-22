import { AuthorStatus } from '@core/shared-kernel/author-status/author-status.value-object';
import { Entity, UniqueEntityID } from '@myforum/building-blocks';
import { AuthorProps, PersistedAuthor } from './author.types';

export class Author extends Entity<AuthorProps> {
  private constructor(props: AuthorProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static fromPersistence({ id, status }: PersistedAuthor) {
    return new Author(
      {
        status: AuthorStatus.fromValue(status),
      },
      new UniqueEntityID(id),
    );
  }

  public getStatus() {
    return this.props.status;
  }

  public toJSON() {
    return {
      id: this.id.value,
      status: this.props.status.getValue(),
    };
  }
}
