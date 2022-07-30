import { PostRepository } from '@core/post-management/post/post.repository';
import { RawPost } from '@core/post-management/post/post.types';
import { QueryHandler } from '@myforum/building-blocks';
import { GetSinglePostQuery } from './get-single-post.query';

interface Dependencies {
  postRepository: PostRepository;
}

export class GetSinglePostQueryHandler implements QueryHandler<GetSinglePostQuery, RawPost | null> {
  constructor(private readonly dependencies: Dependencies) {}

  public async handle({ payload: { id } }: GetSinglePostQuery): Promise<RawPost | null> {
    const { postRepository } = this.dependencies;

    const post = await postRepository.findById(id);

    if (!post) {
      return null;
    }

    return post.toJSON();
  }
}
