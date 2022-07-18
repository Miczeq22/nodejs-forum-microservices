export declare class Command<PayloadType extends object = {}> {
    readonly payload: PayloadType;
    constructor(payload: PayloadType);
}
