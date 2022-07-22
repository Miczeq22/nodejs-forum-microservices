import { BusinessRule } from '@myforum/building-blocks';

export class PostContentMustBeValidRule implements BusinessRule {
  public message = 'Provided post content is invalid.';

  constructor(private readonly content: string) {}

  public isBroken(): boolean {
    if (this.content.split(' ').length < 3) {
      this.message = 'Content must containt at least 3 words.';

      return true;
    }

    if (this.content.split(' ').length > 1000) {
      this.message = "Content can't contain more than 1000 words.";

      return true;
    }

    return false;
  }
}
