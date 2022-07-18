import { DomainEvent } from '..';

export interface SagaStep<
  Payload extends object | void,
  SuccessEvent extends DomainEvent<any>,
  RollbackEvent extends DomainEvent<any>,
> {
  process(data: Payload): Promise<SuccessEvent>;
  rollback(data: Payload): Promise<RollbackEvent>;
}
