"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMqMessageBus = exports.MessageType = void 0;
const domain_event_1 = require("../../../core/domain-event");
const amqplib_1 = __importDefault(require("amqplib"));
const opentracing_1 = require("opentracing");
var MessageType;
(function (MessageType) {
    MessageType["Command"] = "Command";
    MessageType["Event"] = "Event";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
class RabbitMqMessageBus {
    constructor(dependencies) {
        this.dependencies = dependencies;
    }
    async init() {
        const connection = await amqplib_1.default.connect(this.dependencies.rabbitUrl);
        this.channel = await connection.createChannel();
        await this.channel.assertExchange(this.dependencies.serviceName, 'topic', {
            durable: true,
        });
    }
    async sendEvent(event, context) {
        const span = this.dependencies.tracer.startSpan(`[Message Bus] Publishing event${event.constructor.name.replace(/([A-Z])/g, ' $1')}.`, {
            childOf: this.dependencies.tracer.extract(opentracing_1.FORMAT_HTTP_HEADERS, context.spanContext),
        });
        span.addTags({
            'x-type': 'event',
        });
        this.channel.publish(this.dependencies.serviceName, `${event.service}.${event.constructor.name}.${event.service}`, Buffer.from(JSON.stringify({ payload: event.payload, context })));
        span.finish();
    }
    async subscribeToEvent(event, service, callback) {
        await this.channel.assertExchange(service, 'topic', {
            durable: true,
        });
        await this.channel.assertQueue(`${service}.${event}`);
        await this.channel.bindQueue(`${service}.${event}`, service, `${service}.${event.split('.')[0]}.*`);
        await this.channel.consume(`${service}.${event}`, async (message) => {
            const { payload, context } = JSON.parse(message.content.toString());
            const span = this.dependencies.tracer.startSpan(`[Message Bus] Subscribing to event${event.split('.')[0].replace(/([A-Z])/g, ' $1')}.`, {
                childOf: this.dependencies.tracer.extract(opentracing_1.FORMAT_HTTP_HEADERS, context.spanContext),
            });
            span.addTags({
                'x-type': 'event',
            });
            await callback(new domain_event_1.DomainEvent(service, payload), context);
            span.finish();
            this.channel.ack(message);
        }, {
            noAck: false,
        });
    }
}
exports.RabbitMqMessageBus = RabbitMqMessageBus;
//# sourceMappingURL=rabbit-mq.message-bus.js.map