export class DomainEvent<PayloadType extends object | void = void> {
  constructor(public readonly service: string, public readonly payload: PayloadType) {}
}
