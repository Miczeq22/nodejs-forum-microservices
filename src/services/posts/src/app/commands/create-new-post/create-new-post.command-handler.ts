import { Post } from '@core/post-management/post/post.aggregate-root';
import { RawPost } from '@core/post-management/post/post.types';
import { AuthorProvider } from '@core/shared-kernel/author-provider/author-provider.service';
import { CategoryProvider } from '@core/shared-kernel/category-provider/category-provider.service';
import { CommandHandler } from '@myforum/building-blocks';
import { CreateNewPostCommand } from './create-new-post.command';

interface Dependencies {
  authorProvider: AuthorProvider;
  categoryProvider: CategoryProvider;
}

export class CreateNewPostCommandHandler implements CommandHandler<CreateNewPostCommand, RawPost> {
  constructor(private readonly dependencies: Dependencies) {}

  public async handle(command: CreateNewPostCommand): Promise<RawPost> {
    const { authorProvider, categoryProvider } = this.dependencies;

    const post = await Post.createNew(command.payload, {
      authorProvider,
      categoryProvider,
    });

    return post.toJSON();
  }
}
