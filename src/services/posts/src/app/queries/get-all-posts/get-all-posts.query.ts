import { PaginatedQuery, Query } from '@myforum/building-blocks';

export class GetAllPostsQuery implements Query<PaginatedQuery> {
  constructor(public readonly payload: PaginatedQuery) {}
}
