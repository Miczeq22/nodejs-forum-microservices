export interface Logger {
    log: LogMethod;
    error: ErrorLogMethod;
    warn: LeveledLogMethod;
    info: LeveledLogMethod;
    verbose: LeveledLogMethod;
    debug: LeveledLogMethod;
}
export declare type LogMethod = (level: string, message: string) => Logger;
export declare type LeveledLogMethod = (message: string, payload?: unknown) => Logger;
export declare type ErrorLogMethod = (message: string, error?: unknown) => Logger;
export declare const logger: (serviceName: string) => Logger;
