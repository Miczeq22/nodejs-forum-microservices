import { DomainEvent } from '../../../core/domain-event';
import { CommandBus } from '../../../app/command-bus';
import { EventSubscriber } from '../../../app/event-subscriber';
import { Tracer } from 'opentracing';
import { MessageBus, MessageContext } from '../message-bus';
interface Dependencies {
    commandBus: CommandBus;
    subscribers: EventSubscriber<any>[];
    rabbitUrl: string;
    serviceName: string;
    tracer: Tracer;
}
export declare enum MessageType {
    Command = "Command",
    Event = "Event"
}
export declare class RabbitMqMessageBus implements MessageBus {
    private readonly dependencies;
    private channel;
    constructor(dependencies: Dependencies);
    init(): Promise<void>;
    sendEvent(event: DomainEvent<{}>, context: MessageContext): Promise<void>;
    subscribeToEvent(event: string, service: string, callback: (EventType: DomainEvent<any>, context: MessageContext) => Promise<void>): Promise<void>;
}
export {};
