import { DomainEvent } from '@core/domain-event';
import { SpanContext } from 'opentracing';

export interface MessageBroker {
  subscribeToTopics(topics: string[]): Promise<void | never>;

  sendMessage(
    topic: string,
    event: DomainEvent,
    key: string,
    spanContext: SpanContext,
  ): Promise<void | never>;

  disconnect(): Promise<void>;
}
