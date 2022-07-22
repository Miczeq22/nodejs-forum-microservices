import { BusinessRule } from '@myforum/building-blocks';

export class PostTitleMustBeValidRule implements BusinessRule {
  public message = 'Provided post title is invalid.';

  constructor(private readonly title: string) {}

  public isBroken(): boolean {
    if (this.title.length < 3) {
      this.message = 'Post title must contain at least 3 characters.';

      return true;
    }

    if (this.title.length > 256) {
      this.message = 'Post title can contain maximum of 256 characters.';

      return true;
    }

    return false;
  }
}
