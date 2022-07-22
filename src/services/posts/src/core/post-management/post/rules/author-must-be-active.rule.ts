import { AuthorStatus } from '@core/shared-kernel/author-status/author-status.value-object';
import { Author } from '@core/shared-kernel/author/author.entity';
import { BusinessRule } from '@myforum/building-blocks';

export class AuthorMustBeActiveRule implements BusinessRule {
  public readonly message = 'Unauthorized.';

  constructor(private readonly author: Author) {}

  public isBroken(): boolean {
    return !this.author.getStatus().equals(AuthorStatus.Active);
  }
}
