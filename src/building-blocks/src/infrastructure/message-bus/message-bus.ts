import { DomainEvent } from '@core/domain-event';
import { SpanContext } from 'opentracing';

export interface MessageContext {
  spanContext: SpanContext;
}

export interface MessageBus {
  init(): Promise<void>;

  subscribeToEvent(
    event: string,
    service: string,
    callback: (EventType: DomainEvent<any>, context: MessageContext) => Promise<void>,
  ): Promise<void>;

  sendEvent(event: DomainEvent<any>, context: MessageContext): Promise<void>;
}
