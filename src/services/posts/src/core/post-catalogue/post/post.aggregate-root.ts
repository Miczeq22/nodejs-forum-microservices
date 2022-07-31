import { AggregateRoot, UniqueEntityID } from '@myforum/building-blocks';
import { Comment } from '../comment/comment.entity';
import { CreateNewCommentPayload } from '../comment/comment.types';
import { NewCommentAddedToPostEvent } from './events/new-comment-added-to-post.event';
import { PersistedPost, PostProps, RawPost } from './post.types';

export class Post extends AggregateRoot<PostProps> {
  private constructor(props: PostProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static fromPersistence({ id }: PersistedPost) {
    return new Post(
      {
        commentToAdd: null,
        commentToEdit: null,
        commentIdToDelete: null,
      },
      new UniqueEntityID(id),
    );
  }

  public addNewComment(payload: CreateNewCommentPayload) {
    const comment = Comment.createNew(payload);

    this.props.commentToAdd = comment;

    this.addDomainEvent(
      new NewCommentAddedToPostEvent({
        postId: this.id.value,
        accountId: payload.authorId,
        createdAt: comment.getCreatedAt().toISOString(),
      }),
    );
  }

  public getId() {
    return this.id;
  }

  public toJSON(): RawPost {
    return {
      id: this.id.value,
      commentToAdd: this.props.commentToAdd ? this.props.commentToAdd.toJSON() : null,
      commentToEdit: this.props.commentToEdit ? this.props.commentToEdit.toJSON() : null,
      commentIdToDelete: this.props.commentIdToDelete ? this.props.commentIdToDelete.value : null,
    };
  }
}
