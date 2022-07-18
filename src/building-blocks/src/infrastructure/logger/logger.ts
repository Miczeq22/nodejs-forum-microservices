import * as Winston from 'winston';
import { SeqTransport } from '@datalust/winston-seq';

export interface Logger {
  log: LogMethod;
  error: ErrorLogMethod;
  warn: LeveledLogMethod;
  info: LeveledLogMethod;
  verbose: LeveledLogMethod;
  debug: LeveledLogMethod;
}

export type LogMethod = (level: string, message: string) => Logger;

export type LeveledLogMethod = (message: string, payload?: unknown) => Logger;

export type ErrorLogMethod = (message: string, error?: unknown) => Logger;

const logFormat = Winston.format.printf(
  ({ level, message, service, timestamp }) => `${service}:  ${timestamp} | [${level}]: ${message}`,
);

export const logger = (serviceName: string): Logger =>
  Winston.createLogger({
    handleExceptions: true,
    level: process.env.LOGGING_LEVEL ?? 'debug',
    silent: process.env.ENV === 'test',
    defaultMeta: {
      service: serviceName,
    },
    format: Winston.format.combine(
      Winston.format.colorize({}),
      Winston.format.errors({
        stack: true,
      }),
      Winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      logFormat,
    ),
    transports: [
      new Winston.transports.Console(),
      new SeqTransport({
        level: 'debug',
        serverUrl: 'http://127.0.0.1:5341',
        apiKey: 'O8lyxdRwWgOwlWLgvbid',
        onError: (e) => console.error(e),
      }),
    ],
  });
