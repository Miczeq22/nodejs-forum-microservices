import { AggregateRoot, DomainEvent } from '..';

export interface EventDispatcher {
  dispatchEvent(event: DomainEvent<any>): Promise<void>;

  dispatchEventsForAggregate(aggregate: AggregateRoot): Promise<void>;
}
