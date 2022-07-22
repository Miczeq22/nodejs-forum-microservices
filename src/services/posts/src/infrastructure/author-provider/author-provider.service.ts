import { AuthorProvider } from '@core/shared-kernel/author-provider/author-provider.service';
import { AuthorStatus } from '@core/shared-kernel/author-status/author-status.value-object';
import { Author } from '@core/shared-kernel/author/author.entity';

export class InMemoryAuthorProvider implements AuthorProvider {
  public async getById(): Promise<Author> {
    return Author.fromPersistence({
      id: 'effce917-00e9-4fc2-9c00-02a69d294249',
      status: AuthorStatus.Active.getValue(),
    });
  }
}
