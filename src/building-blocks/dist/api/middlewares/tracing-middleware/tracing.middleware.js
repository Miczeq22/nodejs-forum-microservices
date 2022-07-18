"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tracingMiddleware = void 0;
const opentracing_1 = require("opentracing");
const tracingMiddleware = ({ tracer }) => (req, res, next) => {
    const existingContext = tracer.extract(opentracing_1.FORMAT_HTTP_HEADERS, req.headers);
    if (existingContext) {
        return next();
    }
    const newContext = {};
    const span = tracer.startSpan(`Request [${req.method}] ${req.originalUrl}`);
    span.addTags({
        'x-type': 'action',
    });
    tracer.inject(span.context(), opentracing_1.FORMAT_HTTP_HEADERS, newContext);
    req.headers = {
        ...req.headers,
        ...newContext,
    };
    span.finish();
    next();
};
exports.tracingMiddleware = tracingMiddleware;
//# sourceMappingURL=tracing.middleware.js.map