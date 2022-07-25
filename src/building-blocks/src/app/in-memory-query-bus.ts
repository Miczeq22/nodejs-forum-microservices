import { FORMAT_HTTP_HEADERS, SpanContext, Tags, Tracer } from 'opentracing';
import { NotFoundError } from '..';
import { Query } from './query';
import { QueryBus } from './query-bus';
import { QueryHandler } from './query-handler';

interface QueryHandlers {
  [key: string]: QueryHandler<any, any>;
}

interface Dependencies {
  queryHandlers: QueryHandler<any, any>[];
  tracer: Tracer;
  spanContext: SpanContext;
}

export class InMemoryQueryBus implements QueryBus {
  private existingQueryHandlers: QueryHandlers = {};

  constructor(private readonly dependencies: Dependencies) {
    this.existingQueryHandlers = dependencies.queryHandlers.reduce(
      (queryHandlers: QueryHandlers, currentHandler: QueryHandler<any, any>) => {
        return {
          ...queryHandlers,
          [this.getConstructorName(currentHandler)]: currentHandler,
        };
      },
      {},
    );
  }

  public async handle(query: Query<any>): Promise<unknown> {
    const { tracer } = this.dependencies;

    const context = tracer.extract(FORMAT_HTTP_HEADERS, this.dependencies.spanContext);

    const span = tracer.startSpan(
      `[Query Bus] Handling query${query.constructor.name.replace(/([A-Z])/g, ' $1')}`,
      {
        childOf: context,
      },
    );

    span.setTag(Tags.COMPONENT, 'query-bus');

    const existingQueryHandler = this.existingQueryHandlers[this.getQueryHandlerName(query)];

    if (!existingQueryHandler) {
      const error = new NotFoundError(
        `Query Handler for query: "${this.getConstructorName(query)}" does not exist.`,
      );

      span.setTag(Tags.ERROR, true);
      span.log({
        event: 'error',
        'error.object': error,
        message: error.message,
        stack: error.stack,
      });

      span.finish();

      throw error;
    }

    try {
      return await existingQueryHandler.handle(query);
    } catch (error) {
      span.setTag(Tags.ERROR, true);

      span.log({
        event: 'error',
        'error.object': error,
        message: error.message,
        stack: error.stack,
      });

      throw error;
    } finally {
      span.finish();
    }
  }

  private getConstructorName(object: object) {
    return object.constructor.name;
  }

  private getQueryHandlerName(query: Query<any>) {
    return `${this.getConstructorName(query)}Handler`;
  }
}
