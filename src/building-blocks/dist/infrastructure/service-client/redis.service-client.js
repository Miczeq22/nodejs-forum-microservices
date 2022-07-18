"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisServiceClient = void 0;
/* eslint-disable no-async-promise-executor */
const my_forum_error_1 = require("../../errors/my-forum.error");
const opentracing_1 = require("opentracing");
const redis = __importStar(require("redis"));
class RedisServiceClient {
    constructor(dependencies) {
        this.dependencies = dependencies;
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();
    }
    async bootstrap() {
        await Promise.all([this.publisher.connect(), this.subscriber.connect()]);
    }
    async send(topic, payload, context) {
        return new Promise(async (resolve, reject) => {
            const { tracer } = this.dependencies;
            const span = tracer.startSpan(`[Service Client] Sending request for topic ${topic}.`, {
                childOf: tracer.extract(opentracing_1.FORMAT_HTTP_HEADERS, context.requestHeaders),
            });
            span.addTags({
                'x-type': 'request',
            });
            const headers = {};
            tracer.inject(span.context(), opentracing_1.FORMAT_HTTP_HEADERS, headers);
            const replyTopic = this.getReplyTopic(topic);
            await this.publisher.publish(topic, JSON.stringify({ payload, headers }));
            await this.subscriber.subscribe(replyTopic, async (message) => {
                const result = JSON.parse(message);
                if ('error' in result) {
                    const { error } = result;
                    await this.subscriber.unsubscribe(replyTopic);
                    span.finish();
                    return reject(new my_forum_error_1.MyForumError(error.message, error.name, error.errorCode));
                }
                span.finish();
                resolve(result);
            });
        });
    }
    async subscribe(topic, callback) {
        const { tracer } = this.dependencies;
        await this.subscriber.subscribe(topic, async (message) => {
            const { payload, headers } = JSON.parse(message);
            const span = tracer.startSpan(`[Service Client] Handle request for topic ${topic}.`, {
                childOf: tracer.extract(opentracing_1.FORMAT_HTTP_HEADERS, headers),
            });
            span.addTags({
                'x-type': 'request',
            });
            const spanHeaders = {};
            tracer.inject(span.context(), opentracing_1.FORMAT_HTTP_HEADERS, spanHeaders);
            try {
                const result = await callback(payload, {
                    spanContext: spanHeaders,
                });
                await this.publisher.publish(this.getReplyTopic(topic), JSON.stringify(result !== null && result !== void 0 ? result : {}));
            }
            catch (error) {
                await this.publisher.publish(this.getReplyTopic(topic), JSON.stringify({ error }));
            }
            finally {
                span.finish();
            }
        });
    }
    getReplyTopic(topic) {
        return `${topic}.reply`;
    }
}
exports.RedisServiceClient = RedisServiceClient;
//# sourceMappingURL=redis.service-client.js.map