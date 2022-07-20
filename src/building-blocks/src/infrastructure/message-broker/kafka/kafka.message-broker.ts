import { EventSubscriber } from '@app/event-subscriber';
import { DomainEvent } from '@core/domain-event';
import { Logger } from '@infrastructure/logger';
import Kafka from 'kafka-node';
import { MessageBroker } from '../message-broker';

interface Dependencies {
  url: string;
  eventSubscribers: EventSubscriber<any>[];
  logger: Logger;
}

export class KafkaMessageBroker implements MessageBroker {
  private client: Kafka.KafkaClient;

  private consumers = new Map<string, Kafka.Consumer>();

  private producers = new Map<string, Kafka.Producer>();

  constructor(private readonly dependencies: Dependencies) {
    this.client = new Kafka.KafkaClient({
      kafkaHost: dependencies.url,
    });

    this.client.connect();

    this.client
      .on('connect', () => {
        dependencies.logger.info('[Kafka Message Broker] Connected with Kafka.');
      })
      .on('error', (error) => {
        dependencies.logger.error(
          '[Kafka Message Broker] Error occured while connecting with Kafka.',
          error,
        );
      });
  }

  public async subscribeToTopics(topics: string[]): Promise<void> {
    topics.forEach(this.subscribeToTopic.bind(this));
  }

  public async sendMessage(topic: string, event: DomainEvent<void>, key: string): Promise<void> {
    if (!this.producers.has(topic)) {
      const producer = new Kafka.Producer(this.client, {
        requireAcks: 1,
      });

      this.producers.set(topic, producer);
    }

    const producer = this.producers.get(topic);

    producer.send(
      [
        {
          topic,
          key,
          messages: JSON.stringify({
            payload: event.payload,
            type: event.constructor.name,
          }),
        },
      ],
      (error) => {
        if (error) {
          this.dependencies.logger.error(
            '[Kafka Message Broker]: Error while sending message.',
            error,
          );
        }
      },
    );
  }

  private subscribeToTopic(topic: string) {
    if (!this.consumers.has(topic)) {
      const consumer = new Kafka.Consumer(
        this.client,
        [
          {
            topic,
          },
        ],
        {
          autoCommit: true,
        },
      );

      this.consumers.set(topic, consumer);
    }

    const consumer = this.consumers.get(topic);

    consumer.on('message', (message) => {
      const { type, payload } = JSON.parse(message.value as string);

      this.dependencies.eventSubscribers
        .filter((eventSubscriber) => eventSubscriber.type === type)
        .map((eventSubscriber) => eventSubscriber.handle(new DomainEvent(payload)));
    });
  }
}
