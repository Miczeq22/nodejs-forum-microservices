"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TracerBuilder = void 0;
const sdk_trace_node_1 = require("@opentelemetry/sdk-trace-node");
const resources_1 = require("@opentelemetry/resources");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
const exporter_jaeger_1 = require("@opentelemetry/exporter-jaeger");
const shim_opentracing_1 = require("@opentelemetry/shim-opentracing");
const instrumentation_1 = require("@opentelemetry/instrumentation");
const instrumentation_http_1 = require("@opentelemetry/instrumentation-http");
class TracerBuilder {
    constructor(serviceName) {
        this.provider = new sdk_trace_node_1.NodeTracerProvider({
            resource: new resources_1.Resource({
                [semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME]: serviceName,
            }),
        });
        this.provider.addSpanProcessor(new sdk_trace_base_1.BatchSpanProcessor(this.getExporter()));
        (0, instrumentation_1.registerInstrumentations)({
            tracerProvider: this.provider,
            instrumentations: [new instrumentation_http_1.HttpInstrumentation()],
        });
        this.provider.register();
    }
    build() {
        return new shim_opentracing_1.TracerShim(this.provider.getTracer('opentracing-shim'));
    }
    getExporter() {
        return new exporter_jaeger_1.JaegerExporter();
    }
}
exports.TracerBuilder = TracerBuilder;
//# sourceMappingURL=tracer.builder.js.map