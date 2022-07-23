import { BusinessRule } from '@myforum/building-blocks';

export class EmailFormatMustBeValidRule implements BusinessRule {
  public readonly message = 'Provided email have invalid format.';

  constructor(private readonly email: string) {}

  public isBroken(): boolean {
    return !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.email);
  }
}
