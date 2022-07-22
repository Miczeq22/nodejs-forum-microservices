import { Tracer } from 'opentracing';
import { NotFoundError, Logger } from '..';
import { Command } from './command';
import { CommandBus } from './command-bus';
import { CommandHandler } from './command-handler';

interface CommandHandlers {
  [key: string]: CommandHandler<any, any>;
}

interface Dependencies {
  commandHandlers: CommandHandler<any, any>[];
  tracer: Tracer;
  logger: Logger;
}

export class InMemoryCommandBus implements CommandBus {
  private existingCommandHandlers: CommandHandlers = {};

  constructor(private readonly dependencies: Dependencies) {
    this.existingCommandHandlers = dependencies.commandHandlers.reduce(
      (commandHandlers: CommandHandlers, currentHandler: CommandHandler<any, any>) => {
        return {
          ...commandHandlers,
          [this.getConstructorName(currentHandler)]: currentHandler,
        };
      },
      {},
    );
  }

  public async handle(command: Command<any>): Promise<unknown> {
    const { logger } = this.dependencies;

    const existingCommandHandler =
      this.existingCommandHandlers[this.getCommandHandlerName(command)];

    if (!existingCommandHandler) {
      throw new NotFoundError(
        `Command Handler for command: "${this.getConstructorName(command)}" does not exist.`,
      );
    }

    try {
      const result = await existingCommandHandler.handle(command);

      return result;
    } catch (error) {
      logger.error(`[Command Bus] Can't process command: ${command.constructor.name}.`, error);
      throw error;
    }
  }

  private getConstructorName(object: object) {
    return object.constructor.name;
  }

  private getCommandHandlerName(command: Command<any>) {
    return `${this.getConstructorName(command)}Handler`;
  }
}
