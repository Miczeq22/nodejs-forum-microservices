import { MyForumError } from '@myforum/building-blocks';

export class AccountStatusNotSupportedError extends MyForumError {
  constructor(message = 'Provided Account Status is not supported.') {
    super(message, 'AccountStatusNotSupportedError', 422);
  }
}
