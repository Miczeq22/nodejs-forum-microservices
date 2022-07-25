import { FORMAT_HTTP_HEADERS, SpanContext, Tags, Tracer } from 'opentracing';
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
  spanContext: SpanContext;
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
    const { logger, tracer, spanContext } = this.dependencies;

    const context = tracer.extract(FORMAT_HTTP_HEADERS, spanContext);

    const span = tracer.startSpan(
      `[Command Bus] Handling command${command.constructor.name.replace(/([A-Z])/g, ' $1')}.`,
      {
        childOf: context,
      },
    );

    span.setTag(Tags.COMPONENT, 'command-bus');

    const existingCommandHandler =
      this.existingCommandHandlers[this.getCommandHandlerName(command)];

    if (!existingCommandHandler) {
      const error = new NotFoundError(
        `Command Handler for command: "${this.getConstructorName(command)}" does not exist.`,
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
      const result = await existingCommandHandler.handle(command);

      return result;
    } catch (error) {
      logger.error(`[Command Bus] Can't process command: ${command.constructor.name}.`, error);

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

  private getCommandHandlerName(command: Command<any>) {
    return `${this.getConstructorName(command)}Handler`;
  }
}
