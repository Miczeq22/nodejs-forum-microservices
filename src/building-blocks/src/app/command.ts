export class Command<PayloadType extends object = {}> {
  constructor(public readonly payload: PayloadType) {}
}
