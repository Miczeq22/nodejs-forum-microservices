import { CommentStatus } from '@core/shared-kernel/comment-status/comment-status.value-object';
import { Entity, UniqueEntityID } from '@myforum/building-blocks';
import { CommentProps, CreateNewCommentPayload, RawComment } from './comment.types';

export class Comment extends Entity<CommentProps> {
  private constructor(props: CommentProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static createNew({ authorId, content }: CreateNewCommentPayload) {
    return new Comment({
      content,
      authorId: new UniqueEntityID(authorId),
      createdAt: new Date(),
      updatedAt: null,
      status: CommentStatus.Active,
    });
  }

  public getCreatedAt() {
    return this.props.createdAt;
  }

  public toJSON(): RawComment {
    return {
      id: this.id.value,
      content: this.props.content,
      authorId: this.props.authorId.value,
      createdAt: this.props.createdAt.toISOString(),
      updatedAt: this.props.updatedAt ? this.props.updatedAt.toISOString() : null,
      status: this.props.status.getValue(),
    };
  }
}
