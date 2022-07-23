import { InputValidationError } from '@myforum/building-blocks';

export class AccountStatusNotSupportedError extends InputValidationError {
  constructor() {
    super('Provided Account Status is not supported.');
  }
}
