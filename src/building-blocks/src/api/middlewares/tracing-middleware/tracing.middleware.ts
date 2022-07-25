/* eslint-disable no-param-reassign */
import { asValue, AwilixContainer } from 'awilix';
import { RequestHandler } from 'express';
import { FORMAT_HTTP_HEADERS, Tags, Tracer } from 'opentracing';

interface Dependencies {
  tracer: Tracer;
  container: AwilixContainer;
}

export const tracingMiddleware =
  ({ tracer, container }: Dependencies): RequestHandler =>
  (req, _, next) => {
    const existingContext = tracer.extract(FORMAT_HTTP_HEADERS, req.headers);

    if (existingContext) {
      const span = tracer.startSpan(`Request [${req.method}] ${req.originalUrl}`, {
        childOf: existingContext,
      });

      span.setTag(Tags.HTTP_METHOD, req.method);
      span.setTag(Tags.HTTP_URL, req.originalUrl);
      span.setTag(Tags.COMPONENT, 'action');

      return next();
    }

    const newContext = {};

    const span = tracer.startSpan(`Request [${req.method}] ${req.originalUrl}`);
    span.setTag(Tags.HTTP_METHOD, req.method);
    span.setTag(Tags.HTTP_URL, req.originalUrl);
    span.setTag(Tags.COMPONENT, 'action');

    tracer.inject(span.context(), FORMAT_HTTP_HEADERS, newContext);

    container.register({
      spanContext: asValue(newContext),
    });

    req.headers = {
      ...req.headers,
      ...newContext,
    };

    span.finish();

    next();
  };
