export declare class MyForumError extends Error {
    readonly message: string;
    readonly name: string;
    readonly errorCode: number;
    constructor(message: string, name?: string, errorCode?: number);
    toString(): string;
    toJSON(): {
        name: string;
        message: string;
        errorCode: number;
    };
}
