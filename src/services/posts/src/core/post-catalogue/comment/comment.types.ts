import { CommentStatus } from '@core/shared-kernel/comment-status/comment-status.value-object';
import { UniqueEntityID } from '@myforum/building-blocks';

export interface CommentProps {
  authorId: UniqueEntityID;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
  status: CommentStatus;
}

export interface CreateNewCommentPayload {
  authorId: string;
  content: string;
}

export interface RawComment {
  id: string;
  authorId: string;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
}
