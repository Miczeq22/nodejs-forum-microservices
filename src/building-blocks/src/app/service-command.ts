export class ServiceCommand<PayloadType extends object = {}> {
  constructor(public readonly payload: PayloadType) {}
}
