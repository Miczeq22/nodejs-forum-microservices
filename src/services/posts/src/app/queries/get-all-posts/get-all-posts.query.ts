import { Query } from '@myforum/building-blocks';

export class GetAllPostsQuery implements Query<{}> {
  constructor(public readonly payload = {}) {}
}
