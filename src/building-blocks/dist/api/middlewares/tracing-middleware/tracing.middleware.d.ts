import { RequestHandler } from 'express';
import { Tracer } from 'opentracing';
interface Dependencies {
    tracer: Tracer;
}
export declare const tracingMiddleware: ({ tracer }: Dependencies) => RequestHandler;
export {};
