import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { TracerShim } from '@opentelemetry/shim-opentracing';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';

export class TracerBuilder {
  private provider: NodeTracerProvider;

  constructor(serviceName: string, url: string = '') {
    this.provider = new NodeTracerProvider({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
      }),
    });

    this.provider.addSpanProcessor(new BatchSpanProcessor(this.getExporter(url)));

    registerInstrumentations({
      tracerProvider: this.provider,
      instrumentations: [new HttpInstrumentation()],
    });

    this.provider.register();
  }

  public build() {
    return new TracerShim(this.provider.getTracer('opentracing-shim'));
  }

  private getExporter(url: string) {
    return new JaegerExporter({
      endpoint: url,
    });
  }
}
