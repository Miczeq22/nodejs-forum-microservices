import { MyForumError } from '@errors/my-forum.error';

export class NotFoundError extends MyForumError {
  constructor(message = 'Not Found.') {
    super(message, 'NotFoundError', 422);
  }
}
