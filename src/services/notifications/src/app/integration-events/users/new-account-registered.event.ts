import { DomainEvent } from '@myforum/building-blocks';

interface Payload {
  accountId: string;
  accountEmail: string;
}

export class NewAccountRegisteredEvent implements DomainEvent<Payload> {
  constructor(public readonly payload: Payload) {}
}
