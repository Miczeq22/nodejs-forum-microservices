import { CreateNewCommentPayload } from '@core/post-catalogue/comment/comment.types';
import { Command } from '@myforum/building-blocks';

export type AddNewCommentCommandPayload = CreateNewCommentPayload & {
  postId: string;
};

export class AddNewCommentCommand implements Command<AddNewCommentCommandPayload> {
  constructor(public readonly payload: AddNewCommentCommandPayload) {}
}
