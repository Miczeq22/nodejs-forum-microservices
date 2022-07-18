import { MyForumError } from './my-forum.error';

export class BusinessRuleValidationError extends MyForumError {
  constructor(message: string) {
    super(message, 'BusinessRuleValidationError', 400);
  }
}
