import { Tracer } from 'opentracing';
import { NotFoundError } from '..';
import { Query } from './query';
import { QueryBus, QueryContext } from './query-bus';
import { QueryHandler } from './query-handler';

interface QueryHandlers {
  [key: string]: QueryHandler<any, any>;
}

interface Dependencies {
  queryHandlers: QueryHandler<any, any>[];
  tracer: Tracer;
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

  public async handle(query: Query<any>, { context }: QueryContext): Promise<unknown> {
    const { tracer } = this.dependencies;

    const span = tracer.startSpan(
      `[Query Bus] Handling query${query.constructor.name.replace(/([A-Z])/g, ' $1')}`,
      {
        childOf: context,
      },
    );

    span.addTags({
      'x-type': 'query',
    });

    const existingQueryHandler = this.existingQueryHandlers[this.getQueryHandlerName(query)];

    if (!existingQueryHandler) {
      span.finish();

      throw new NotFoundError(
        `Query Handler for query: "${this.getConstructorName(query)}" does not exist.`,
      );
    }

    const result = await existingQueryHandler.handle(query);

    span.finish();

    return result;
  }

  private getConstructorName(object: object) {
    return object.constructor.name;
  }

  private getQueryHandlerName(query: Query<any>) {
    return `${this.getConstructorName(query)}Handler`;
  }
}
