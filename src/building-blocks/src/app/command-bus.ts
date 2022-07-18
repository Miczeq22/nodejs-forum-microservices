import { SpanContext } from 'opentracing';
import { Command } from './command';

export interface CommandContext {
  context: SpanContext;
}

export interface CommandBus {
  handle(command: Command<any>, context: CommandContext): Promise<unknown>;
}
