import { PostRepository } from '@core/post-management/post/post.repository';
import { RawPost } from '@core/post-management/post/post.types';
import {
  PaginatedResponse,
  QueryHandler,
  serializeDataToPaginatedResponse,
} from '@myforum/building-blocks';
import { GetAllPostsQuery } from './get-all-posts.query';

interface Dependencies {
  postRepository: PostRepository;
}

export class GetAllPostsQueryHandler
  implements QueryHandler<GetAllPostsQuery, PaginatedResponse<RawPost>>
{
  constructor(private readonly dependencies: Dependencies) {}

  public async handle({
    payload: { itemsPerPage, page },
  }: GetAllPostsQuery): Promise<PaginatedResponse<RawPost>> {
    const posts = await this.dependencies.postRepository.findAll();

    const data = posts.map((post) => post.toJSON()).splice((page - 1) * itemsPerPage, itemsPerPage);

    return serializeDataToPaginatedResponse<RawPost>(data, data.length, page, itemsPerPage);
  }
}
