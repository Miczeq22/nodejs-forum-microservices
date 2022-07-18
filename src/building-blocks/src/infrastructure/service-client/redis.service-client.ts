/* eslint-disable no-async-promise-executor */
import { MyForumError } from '@errors/my-forum.error';
import { FORMAT_HTTP_HEADERS, SpanContext, Tracer } from 'opentracing';
import * as redis from 'redis';
import {
  ServiceClient,
  ServiceClientContext,
  ServiceClientSubscriberContext,
} from './service-client';

interface Dependencies {
  tracer: Tracer;
}

export class RedisServiceClient implements ServiceClient {
  private publisher: redis.RedisClientType;

  private subscriber: redis.RedisClientType;

  constructor(private readonly dependencies: Dependencies) {
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();
  }

  public async bootstrap(): Promise<void> {
    await Promise.all([this.publisher.connect(), this.subscriber.connect()]);
  }

  public async send<PayloadType extends object = {}>(
    topic: string,
    payload: PayloadType,
    context: ServiceClientContext,
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const { tracer } = this.dependencies;

      const span = tracer.startSpan(`[Service Client] Sending request for topic ${topic}.`, {
        childOf: tracer.extract(FORMAT_HTTP_HEADERS, context.requestHeaders),
      });

      span.addTags({
        'x-type': 'request',
      });

      const headers = {};

      tracer.inject(span.context(), FORMAT_HTTP_HEADERS, headers);

      const replyTopic = this.getReplyTopic(topic);

      await this.publisher.publish(topic, JSON.stringify({ payload, headers }));

      await this.subscriber.subscribe(replyTopic, async (message) => {
        const result = JSON.parse(message);

        if ('error' in result) {
          const { error } = result;

          await this.subscriber.unsubscribe(replyTopic);

          span.finish();

          return reject(new MyForumError(error.message, error.name, error.errorCode));
        }

        span.finish();
        resolve(result);
      });
    });
  }

  public async subscribe<PayloadType extends object = {}>(
    topic: string,
    callback: (data: PayloadType, context: ServiceClientSubscriberContext) => any | Promise<any>,
  ): Promise<void> {
    const { tracer } = this.dependencies;

    await this.subscriber.subscribe(topic, async (message) => {
      const { payload, headers } = JSON.parse(message);

      const span = tracer.startSpan(`[Service Client] Handle request for topic ${topic}.`, {
        childOf: tracer.extract(FORMAT_HTTP_HEADERS, headers),
      });

      span.addTags({
        'x-type': 'request',
      });

      const spanHeaders = {};

      tracer.inject(span.context(), FORMAT_HTTP_HEADERS, spanHeaders);

      try {
        const result = await callback(payload, {
          spanContext: spanHeaders as SpanContext,
        });

        await this.publisher.publish(this.getReplyTopic(topic), JSON.stringify(result ?? {}));
      } catch (error) {
        await this.publisher.publish(this.getReplyTopic(topic), JSON.stringify({ error }));
      } finally {
        span.finish();
      }
    });
  }

  private getReplyTopic(topic: string) {
    return `${topic}.reply`;
  }
}
