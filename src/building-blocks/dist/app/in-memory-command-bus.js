"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryCommandBus = void 0;
const __1 = require("..");
class InMemoryCommandBus {
    constructor(dependencies) {
        this.dependencies = dependencies;
        this.existingCommandHandlers = {};
        this.existingCommandHandlers = dependencies.commandHandlers.reduce((commandHandlers, currentHandler) => {
            return {
                ...commandHandlers,
                [this.getConstructorName(currentHandler)]: currentHandler,
            };
        }, {});
    }
    async handle(command, { context }) {
        const { tracer, logger } = this.dependencies;
        const span = tracer.startSpan(`[Command Bus] Handling command${command.constructor.name.replace(/([A-Z])/g, ' $1')}.`, {
            childOf: context,
        });
        span.addTags({
            'x-type': 'command',
        });
        const existingCommandHandler = this.existingCommandHandlers[this.getCommandHandlerName(command)];
        if (!existingCommandHandler) {
            span.finish();
            throw new __1.NotFoundError(`Command Handler for command: "${this.getConstructorName(command)}" does not exist.`);
        }
        try {
            const result = await existingCommandHandler.handle(command, {
                spanContext: span.context(),
            });
            return result;
        }
        catch (error) {
            logger.error(`[Command Bus] Can't process command: ${command.constructor.name}.`, error);
            throw error;
        }
        finally {
            span.finish();
        }
    }
    getConstructorName(object) {
        return object.constructor.name;
    }
    getCommandHandlerName(command) {
        return `${this.getConstructorName(command)}Handler`;
    }
}
exports.InMemoryCommandBus = InMemoryCommandBus;
//# sourceMappingURL=in-memory-command-bus.js.map