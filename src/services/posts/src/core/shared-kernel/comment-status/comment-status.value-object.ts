import { CommentStatusNotSupportedError } from '@core/errors/comment-status-not-supported.error';
import { ValueObject } from '@myforum/building-blocks';
import { CommentStatusProps, CommentStatusValue } from './comment-status.types';

export class CommentStatus extends ValueObject<CommentStatusProps> {
  private constructor(value: string) {
    super({
      value,
    });
  }

  public static Active = new CommentStatus(CommentStatusValue.Active);

  public static Banned = new CommentStatus(CommentStatusValue.Banned);

  public static Deleted = new CommentStatus(CommentStatusValue.Deleted);

  public static fromValue(value: string) {
    switch (value) {
      case CommentStatusValue.Active:
        return this.Active;

      case CommentStatusValue.Banned:
        return this.Banned;

      case CommentStatusValue.Deleted:
        return this.Deleted;

      default:
        throw new CommentStatusNotSupportedError();
    }
  }

  public getValue() {
    return this.props.value;
  }
}
