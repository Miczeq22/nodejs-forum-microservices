export declare abstract class CronJob {
    readonly cronPattern: string;
    constructor(cronPattern: string);
    setupJob(): void;
    protected abstract handle(): Promise<void> | void;
}
