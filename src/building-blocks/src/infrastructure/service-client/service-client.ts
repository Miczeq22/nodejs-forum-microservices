import { IncomingHttpHeaders } from 'http';
import { SpanContext } from 'opentracing';

export interface ServiceClientContext {
  requestHeaders: IncomingHttpHeaders;
}

export interface ServiceClientSubscriberContext {
  spanContext: SpanContext;
}

export interface ServiceClient {
  bootstrap(): Promise<void>;

  send<PayloadType extends object = {}>(
    topic: string,
    payload: PayloadType,
    context: ServiceClientContext,
  ): Promise<any>;

  subscribe<PayloadType extends object = {}, Response extends object | void = void>(
    topic: string,
    callback: (data: PayloadType, context: ServiceClientSubscriberContext) => Response,
  ): Promise<void>;
}
