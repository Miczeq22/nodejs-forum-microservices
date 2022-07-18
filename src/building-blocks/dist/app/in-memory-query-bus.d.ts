import { Tracer } from 'opentracing';
import { Query } from './query';
import { QueryBus, QueryContext } from './query-bus';
import { QueryHandler } from './query-handler';
interface Dependencies {
    queryHandlers: QueryHandler<any, any>[];
    tracer: Tracer;
}
export declare class InMemoryQueryBus implements QueryBus {
    private readonly dependencies;
    private existingQueryHandlers;
    constructor(dependencies: Dependencies);
    handle(query: Query<any>, { context }: QueryContext): Promise<unknown>;
    private getConstructorName;
    private getQueryHandlerName;
}
export {};
