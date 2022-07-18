import { MyForumError } from '@errors/my-forum.error';

export class InputValidationError extends MyForumError {
  constructor(message = 'Input Validation Error.') {
    super(message, 'InputValidationError', 422);
  }
}
