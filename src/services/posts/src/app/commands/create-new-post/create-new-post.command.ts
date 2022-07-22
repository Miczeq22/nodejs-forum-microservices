import { CreateNewPostPayload } from '@core/post-management/post/post.types';
import { Command } from '@myforum/building-blocks';

export class CreateNewPostCommand extends Command<CreateNewPostPayload> {
  constructor(public readonly payload: CreateNewPostPayload) {
    super(payload);
  }
}
