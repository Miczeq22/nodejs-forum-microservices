import { Query } from '@myforum/building-blocks';

interface Payload {
  id: string;
}

export class GetSinglePostQuery implements Query<Payload> {
  constructor(public readonly payload: Payload) {}
}
