import { TracerShim } from '@opentelemetry/shim-opentracing';
export declare class TracerBuilder {
    private provider;
    constructor(serviceName: string);
    build(): TracerShim;
    private getExporter;
}
