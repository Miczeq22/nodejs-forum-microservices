import { Tracer } from 'opentracing';
import { NotFoundError, Logger } from '..';
import { Command } from './command';
import { CommandBus, CommandContext } from './command-bus';
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

  public async handle(command: Command<any>, { context }: CommandContext): Promise<unknown> {
    const { tracer, logger } = this.dependencies;

    const span = tracer.startSpan(
      `[Command Bus] Handling command${command.constructor.name.replace(/([A-Z])/g, ' $1')}.`,
      {
        childOf: context,
      },
    );

    span.addTags({
      'x-type': 'command',
    });

    const existingCommandHandler =
      this.existingCommandHandlers[this.getCommandHandlerName(command)];

    if (!existingCommandHandler) {
      span.finish();

      throw new NotFoundError(
        `Command Handler for command: "${this.getConstructorName(command)}" does not exist.`,
      );
    }

    try {
      const result = await existingCommandHandler.handle(command, {
        spanContext: span.context(),
      });

      return result;
    } catch (error) {
      logger.error(`[Command Bus] Can't process command: ${command.constructor.name}.`, error);
      throw error;
    } finally {
      span.finish();
    }
  }

  private getConstructorName(object: object) {
    return object.constructor.name;
  }

  private getCommandHandlerName(command: Command<any>) {
    return `${this.getConstructorName(command)}Handler`;
  }
}
