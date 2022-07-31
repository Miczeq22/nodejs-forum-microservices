import { DomainEvent } from '@myforum/building-blocks';

interface Payload {
  postId: string;
  accountId: string;
  createdAt: string;
}

export class NewCommentAddedToPostEvent implements DomainEvent<Payload> {
  constructor(public readonly payload: Payload) {}
}
