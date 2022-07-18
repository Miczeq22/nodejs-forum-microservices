import { MyForumError } from './my-forum.error';

export class ResourceAlreadyExistsError extends MyForumError {
  constructor(message = 'Resource Already Exists.') {
    super(message, 'ResourceAlreadyExistsError', 409);
  }
}
