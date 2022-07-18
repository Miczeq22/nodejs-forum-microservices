export declare class DomainEvent<PayloadType extends object | void = void> {
    readonly service: string;
    readonly payload: PayloadType;
    constructor(service: string, payload: PayloadType);
}
