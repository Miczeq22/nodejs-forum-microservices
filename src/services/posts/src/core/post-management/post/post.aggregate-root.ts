import { AuthorProvider } from '@core/shared-kernel/author-provider/author-provider.service';
import { CategoryProvider } from '@core/shared-kernel/category-provider/category-provider.service';
import { AggregateRoot, UnauthorizedError, UniqueEntityID } from '@myforum/building-blocks';
import { PostContentMustBeValidRule } from './post-content-must-be-valid.rule';
import { CreateNewPostPayload, PostProps } from './post.types';
import { AuthorMustBeActiveRule } from './rules/author-must-be-active.rule';
import { AuthorMustExistRule } from './rules/author-must-exist.rule';
import { PostTitleMustBeValidRule } from './rules/post-title-must-be-valid.rule';

interface Dependencies {
  categoryProvider: CategoryProvider;
  authorProvider: AuthorProvider;
}

export class Post extends AggregateRoot<PostProps> {
  private constructor(props: PostProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static async createNew(
    { title, content, authorId, category }: CreateNewPostPayload,
    { categoryProvider, authorProvider }: Dependencies,
  ) {
    const author = await authorProvider.getById(authorId);

    Post.checkRule(new AuthorMustExistRule(author), UnauthorizedError);
    Post.checkRule(new AuthorMustBeActiveRule(author));
    Post.checkRule(new PostTitleMustBeValidRule(title));
    Post.checkRule(new PostContentMustBeValidRule(content));

    return new Post({
      title,
      content,
      author,
      status: 'Draft',
      category: await categoryProvider.getByName(category),
      createdAt: new Date(),
      updatedAt: null,
    });
  }
}
