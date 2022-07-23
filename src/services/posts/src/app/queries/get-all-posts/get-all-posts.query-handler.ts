import { PostRepository } from '@core/post-management/post/post.repository';
import { RawPost } from '@core/post-management/post/post.types';
import { QueryHandler } from '@myforum/building-blocks';
import { GetAllPostsQuery } from './get-all-posts.query';

interface Dependencies {
  postRepository: PostRepository;
}

export class GetAllPostsQueryHandler implements QueryHandler<GetAllPostsQuery, RawPost[]> {
  constructor(private readonly dependencies: Dependencies) {}

  public async handle(): Promise<RawPost[]> {
    const posts = await this.dependencies.postRepository.findAll();

    return posts.map((post) => post.toJSON());
  }
}
