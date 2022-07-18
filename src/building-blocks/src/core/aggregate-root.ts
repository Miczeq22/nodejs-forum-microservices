import { DomainEvent } from '@core/domain-event';
import { Entity } from '@core/entity';

export abstract class AggregateRoot<PayloadType extends object = {}> extends Entity<PayloadType> {
  private domainEvents: DomainEvent<any>[] = [];

  protected addDomainEvent(event: DomainEvent<any>) {
    this.domainEvents.push(event);
  }

  public getDomainEvents(): ReadonlyArray<DomainEvent<any>> {
    return this.domainEvents;
  }

  public clearDomainEvents() {
    this.domainEvents = [];
  }
}
