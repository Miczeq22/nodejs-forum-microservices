import { DomainEvent } from './domain-event';
import { Entity } from './entity';
export declare abstract class AggregateRoot<PayloadType extends object = {}> extends Entity<PayloadType> {
    private domainEvents;
    protected addDomainEvent(event: DomainEvent<any>): void;
    getDomainEvents(): ReadonlyArray<DomainEvent<any>>;
    clearDomainEvents(): void;
}
