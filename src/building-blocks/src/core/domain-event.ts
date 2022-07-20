export class DomainEvent<PayloadType extends object | void = void> {
  constructor(public readonly payload: PayloadType) {}
}
