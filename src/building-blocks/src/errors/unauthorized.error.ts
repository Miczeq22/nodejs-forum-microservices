import { MyForumError } from './my-forum.error';

export class UnauthorizedError extends MyForumError {
  constructor(message = 'Unauthorized.') {
    super(message, 'UnauthorizedError', 401);
  }
}
