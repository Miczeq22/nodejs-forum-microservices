import { SpanContext } from 'opentracing';
import { Query } from './query';

export interface QueryContext {
  context: SpanContext;
}

export interface QueryBus {
  handle(query: Query<any>, context: QueryContext): Promise<unknown>;
}
