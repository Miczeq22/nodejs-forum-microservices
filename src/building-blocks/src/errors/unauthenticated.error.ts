import { MyForumError } from './my-forum.error';

export class UnauthenticatedError extends MyForumError {
  constructor(message = 'Unauthenticated.') {
    super(message, 'UnauthenticatedError', 403);
  }
}
