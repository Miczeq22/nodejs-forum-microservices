import { DomainEvent } from '@core/domain-event';
import amqp, { Channel } from 'amqplib';
import { CommandBus } from '@app/command-bus';
import { EventSubscriber } from '@app/event-subscriber';
import { FORMAT_HTTP_HEADERS, Tracer } from 'opentracing';
import { MessageBus, MessageContext } from '../message-bus';

interface Dependencies {
  commandBus: CommandBus;
  subscribers: EventSubscriber<any>[];
  rabbitUrl: string;
  serviceName: string;
  tracer: Tracer;
}

export enum MessageType {
  Command = 'Command',
  Event = 'Event',
}

export class RabbitMqMessageBus implements MessageBus {
  private channel: Channel;

  constructor(private readonly dependencies: Dependencies) {}

  public async init() {
    const connection = await amqp.connect(this.dependencies.rabbitUrl);

    this.channel = await connection.createChannel();

    await this.channel.assertExchange(this.dependencies.serviceName, 'topic', {
      durable: true,
    });
  }

  public async sendEvent(event: DomainEvent<{}>, context: MessageContext): Promise<void> {
    const span = this.dependencies.tracer.startSpan(
      `[Message Bus] Publishing event${event.constructor.name.replace(/([A-Z])/g, ' $1')}.`,
      {
        childOf: this.dependencies.tracer.extract(FORMAT_HTTP_HEADERS, context.spanContext),
      },
    );

    span.addTags({
      'x-type': 'event',
    });

    this.channel.publish(
      this.dependencies.serviceName,
      `${event.constructor.name}`,
      Buffer.from(JSON.stringify({ payload: event.payload, context })),
    );

    span.finish();
  }

  public async subscribeToEvent(
    event: string,
    service: string,
    callback: (EventType: DomainEvent<any>, context: MessageContext) => Promise<void>,
  ): Promise<void> {
    await this.channel.assertExchange(service, 'topic', {
      durable: true,
    });

    await this.channel.assertQueue(`${service}.${event}`);

    await this.channel.bindQueue(
      `${service}.${event}`,
      service,
      `${service}.${event.split('.')[0]}.*`,
    );

    await this.channel.consume(
      `${service}.${event}`,
      async (message) => {
        const { payload, context } = JSON.parse(message.content.toString());

        const span = this.dependencies.tracer.startSpan(
          `[Message Bus] Subscribing to event${event.split('.')[0].replace(/([A-Z])/g, ' $1')}.`,
          {
            childOf: this.dependencies.tracer.extract(FORMAT_HTTP_HEADERS, context.spanContext),
          },
        );

        span.addTags({
          'x-type': 'event',
        });

        await callback(new DomainEvent(payload), context);

        span.finish();

        this.channel.ack(message);
      },
      {
        noAck: false,
      },
    );
  }
}
