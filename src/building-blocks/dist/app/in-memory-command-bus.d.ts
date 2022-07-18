import { Tracer } from 'opentracing';
import { Logger } from '..';
import { Command } from './command';
import { CommandBus, CommandContext } from './command-bus';
import { CommandHandler } from './command-handler';
interface Dependencies {
    commandHandlers: CommandHandler<any, any>[];
    tracer: Tracer;
    logger: Logger;
}
export declare class InMemoryCommandBus implements CommandBus {
    private readonly dependencies;
    private existingCommandHandlers;
    constructor(dependencies: Dependencies);
    handle(command: Command<any>, { context }: CommandContext): Promise<unknown>;
    private getConstructorName;
    private getCommandHandlerName;
}
export {};
