import { MyForumError } from '@myforum/building-blocks';

export class CommentStatusNotSupportedError extends MyForumError {
  constructor(message = 'Provided Comment Status is not supported.') {
    super(message, 'CommentStatusNotSupportedError', 422);
  }
}
