export declare class ServiceCommand<PayloadType extends object = {}> {
    readonly payload: PayloadType;
    constructor(payload: PayloadType);
}
