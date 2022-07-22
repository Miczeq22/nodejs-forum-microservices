import { AuthorProvider } from '@core/shared-kernel/author-provider/author-provider.service';
import { Author } from '@core/shared-kernel/author/author.entity';
import { CategoryProvider } from '@core/shared-kernel/category-provider/category-provider.service';
import { Category } from '@core/shared-kernel/category/category.entity';
import { AggregateRoot, UnauthorizedError, UniqueEntityID } from '@myforum/building-blocks';
import { PostContentMustBeValidRule } from './post-content-must-be-valid.rule';
import { CreateNewPostPayload, PostProps, RawPost } from './post.types';
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

  public static fromPersistence({ id, author, category, createdAt, updatedAt, ...data }: RawPost) {
    return new Post(
      {
        ...data,
        author: Author.fromPersistence(author),
        category: Category.fromPersistence(category),
        createdAt: new Date(createdAt),
        updatedAt: updatedAt ? new Date(updatedAt) : null,
      },
      new UniqueEntityID(id),
    );
  }

  public toJSON(): RawPost {
    return {
      id: this.id.value,
      title: this.props.title,
      content: this.props.content,
      author: this.props.author.toJSON(),
      status: this.props.status,
      category: this.props.category.toJSON(),
      createdAt: this.props.createdAt.toISOString(),
      updatedAt: this.props.updatedAt ? this.props.updatedAt.toISOString() : null,
    };
  }
}
