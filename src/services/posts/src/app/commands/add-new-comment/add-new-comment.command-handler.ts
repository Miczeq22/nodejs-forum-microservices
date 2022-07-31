import { RawComment } from '@core/post-catalogue/comment/comment.types';
import { PostRepository } from '@core/post-catalogue/post/post.repository';
import { CommandHandler, MessageBroker, NotFoundError } from '@myforum/building-blocks';
import { SpanContext } from 'opentracing';
import { AddNewCommentCommand } from './add-new-comment.command';

interface Dependencies {
  postCatalogueRepository: PostRepository;
  messageBroker: MessageBroker;
  spanContext: SpanContext;
}

export class AddNewCommentCommandHandler
  implements CommandHandler<AddNewCommentCommand, RawComment | never>
{
  constructor(private readonly dependencies: Dependencies) {}

  public async handle({
    payload: { postId, ...payload },
  }: AddNewCommentCommand): Promise<RawComment | never> {
    const { postCatalogueRepository, messageBroker, spanContext } = this.dependencies;

    const post = await postCatalogueRepository.findById(postId);

    if (!post) {
      throw new NotFoundError(`Post with id: "${postId}" don't exist.`);
    }

    post.addNewComment(payload);

    await postCatalogueRepository.update(post);

    const eventsToDispatchPromises = post
      .getDomainEvents()
      .map((event) => messageBroker.sendMessage('posts', event, post.getId().value, spanContext));

    await Promise.all(eventsToDispatchPromises);

    const { commentToAdd } = post.toJSON();

    return commentToAdd;
  }
}
