export class DomainEvent<PayloadType extends object = {}> {
  constructor(public readonly payload: PayloadType) {}
}
