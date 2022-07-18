import { DomainEvent, MessageContext } from '..';

export interface EventSubscriber<EventType extends DomainEvent<any>> {
  type: string;

  handle(event: EventType, messageContext: MessageContext): Promise<void>;
}
