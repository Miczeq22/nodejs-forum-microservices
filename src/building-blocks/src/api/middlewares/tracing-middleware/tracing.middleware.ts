/* eslint-disable no-param-reassign */
import { RequestHandler } from 'express';
import { FORMAT_HTTP_HEADERS, Tracer } from 'opentracing';

interface Dependencies {
  tracer: Tracer;
}

export const tracingMiddleware =
  ({ tracer }: Dependencies): RequestHandler =>
  (req, res, next) => {
    const existingContext = tracer.extract(FORMAT_HTTP_HEADERS, req.headers);

    if (existingContext) {
      return next();
    }

    const newContext = {};

    const span = tracer.startSpan(`Request [${req.method}] ${req.originalUrl}`);

    span.addTags({
      'x-type': 'action',
    });

    tracer.inject(span.context(), FORMAT_HTTP_HEADERS, newContext);

    req.headers = {
      ...req.headers,
      ...newContext,
    };

    span.finish();

    next();
  };
