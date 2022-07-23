import { DomainEvent } from '@core/domain-event';

export interface MessageBroker {
  subscribeToTopics(topics: string[]): Promise<void | never>;

  sendMessage(topic: string, event: DomainEvent, key: string): Promise<void | never>;

  disconnect(): Promise<void>;
}
