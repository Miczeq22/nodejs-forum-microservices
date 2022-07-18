import { SpanContext } from 'opentracing';
import { Command } from './command';
import { ServiceCommand } from './service-command';

export interface CommandHandlerContext {
  spanContext: SpanContext;
}

export interface CommandHandler<
  CommandType extends Command<any> | ServiceCommand<any>,
  ResultType extends object | void = void,
> {
  handle(command: CommandType, context: CommandHandlerContext): Promise<ResultType>;
}
