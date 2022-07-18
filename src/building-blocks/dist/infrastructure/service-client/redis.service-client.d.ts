import { Tracer } from 'opentracing';
import { ServiceClient, ServiceClientContext, ServiceClientSubscriberContext } from './service-client';
interface Dependencies {
    tracer: Tracer;
}
export declare class RedisServiceClient implements ServiceClient {
    private readonly dependencies;
    private publisher;
    private subscriber;
    constructor(dependencies: Dependencies);
    bootstrap(): Promise<void>;
    send<PayloadType extends object = {}>(topic: string, payload: PayloadType, context: ServiceClientContext): Promise<any>;
    subscribe<PayloadType extends object = {}>(topic: string, callback: (data: PayloadType, context: ServiceClientSubscriberContext) => any | Promise<any>): Promise<void>;
    private getReplyTopic;
}
export {};
