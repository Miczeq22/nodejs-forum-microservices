import { Author } from '@core/shared-kernel/author/author.entity';
import { BusinessRule } from '@myforum/building-blocks';

export class AuthorMustExistRule implements BusinessRule {
  public readonly message = 'Unauthorized.';

  constructor(private readonly author: Author | null) {}

  public isBroken(): boolean {
    return this.author === null;
  }
}
