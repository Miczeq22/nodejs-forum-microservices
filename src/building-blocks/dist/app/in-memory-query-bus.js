"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryQueryBus = void 0;
const __1 = require("..");
class InMemoryQueryBus {
    constructor(dependencies) {
        this.dependencies = dependencies;
        this.existingQueryHandlers = {};
        this.existingQueryHandlers = dependencies.queryHandlers.reduce((queryHandlers, currentHandler) => {
            return {
                ...queryHandlers,
                [this.getConstructorName(currentHandler)]: currentHandler,
            };
        }, {});
    }
    async handle(query, { context }) {
        const { tracer } = this.dependencies;
        const span = tracer.startSpan(`[Query Bus] Handling query${query.constructor.name.replace(/([A-Z])/g, ' $1')}`, {
            childOf: context,
        });
        span.addTags({
            'x-type': 'query',
        });
        const existingQueryHandler = this.existingQueryHandlers[this.getQueryHandlerName(query)];
        if (!existingQueryHandler) {
            span.finish();
            throw new __1.NotFoundError(`Query Handler for query: "${this.getConstructorName(query)}" does not exist.`);
        }
        const result = await existingQueryHandler.handle(query);
        span.finish();
        return result;
    }
    getConstructorName(object) {
        return object.constructor.name;
    }
    getQueryHandlerName(query) {
        return `${this.getConstructorName(query)}Handler`;
    }
}
exports.InMemoryQueryBus = InMemoryQueryBus;
//# sourceMappingURL=in-memory-query-bus.js.map