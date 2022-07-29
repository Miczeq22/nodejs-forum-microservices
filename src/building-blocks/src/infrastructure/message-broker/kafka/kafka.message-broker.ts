import { EventSubscriber } from '@app/event-subscriber';
import { DomainEvent } from '@core/domain-event';
import { Logger } from '@infrastructure/logger';
import { asValue, AwilixContainer } from 'awilix';
import Kafka from 'kafka-node';
import { FORMAT_HTTP_HEADERS, Span, SpanContext, Tags, Tracer } from 'opentracing';
import { MessageBroker } from '../message-broker';

interface Dependencies {
  url: string;
  eventSubscribers: EventSubscriber<any>[];
  logger: Logger;
  serviceName: string;
  tracer: Tracer;
  container: AwilixContainer;
}

export class KafkaMessageBroker implements MessageBroker {
  private client: Kafka.KafkaClient;

  private consumers = new Map<string, Kafka.ConsumerGroup>();

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

  public async sendMessage(
    topic: string,
    event: DomainEvent<object>,
    key: string,
    spanContext: SpanContext,
  ): Promise<void> {
    if (!this.producers.has(topic)) {
      const producer = new Kafka.Producer(this.client);

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
            spanContext,
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

  public async disconnect(): Promise<void> {
    this.consumers.forEach((consumer) =>
      consumer.close((error) => {
        if (error) {
          this.dependencies.logger.error('Error occured while consumer close connection', error);
        }
      }),
    );

    this.producers.forEach((producer) => producer.close());

    this.client.close();
  }

  private subscribeToTopic(topic: string) {
    const { tracer, container } = this.dependencies;

    if (!this.consumers.has(topic)) {
      const consumer = new Kafka.ConsumerGroup(
        {
          kafkaHost: this.dependencies.url,
          groupId: this.dependencies.serviceName,
        },
        [topic],
      );

      this.consumers.set(topic, consumer);
    }

    const consumer = this.consumers.get(topic);

    consumer.on('message', async (message) => {
      const { type, payload, spanContext } = JSON.parse(message.value as string);

      let span: Span | null = null;

      if (spanContext) {
        const context = tracer.extract(FORMAT_HTTP_HEADERS, spanContext);

        span = tracer.startSpan(
          `[Event Subscriber] Handling event ${type.replace(/([A-Z])/g, ' $1')}.`,
          {
            childOf: context,
          },
        );

        span.setTag(Tags.COMPONENT, 'event-subscriber');

        const newContext = {};

        tracer.inject(span.context(), FORMAT_HTTP_HEADERS, newContext);

        container.register({
          spanContext: asValue(newContext),
        });
      }

      await Promise.all(
        this.dependencies.eventSubscribers
          .filter((eventSubscriber) => eventSubscriber.type === type)
          .map((eventSubscriber) =>
            eventSubscriber
              .handle(new DomainEvent(payload))
              .catch((error) => {
                if (span) {
                  span.setTag(Tags.ERROR, true);
                  span.log({
                    event: 'error',
                    'error.object': error,
                    message: error.message,
                    stack: error.stack,
                  });
                }
              })
              .finally(() => {
                if (span) {
                  span.finish();
                }
              }),
          ),
      );
    });

    consumer.on('error', (error) => {
      this.dependencies.logger.error(
        '[Kafka] Error occurred while connecting to message broker.',
        error,
      );
      this.dependencies.logger.error(error.stack);
    });
  }
}
