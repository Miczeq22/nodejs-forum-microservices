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
exports.logger = void 0;
const Winston = __importStar(require("winston"));
const winston_seq_1 = require("@datalust/winston-seq");
const logFormat = Winston.format.printf(({ level, message, service, timestamp }) => `${service}:  ${timestamp} | [${level}]: ${message}`);
const logger = (serviceName) => {
    var _a;
    return Winston.createLogger({
        handleExceptions: true,
        level: (_a = process.env.LOGGING_LEVEL) !== null && _a !== void 0 ? _a : 'debug',
        silent: process.env.ENV === 'test',
        defaultMeta: {
            service: serviceName,
        },
        format: Winston.format.combine(Winston.format.colorize({}), Winston.format.errors({
            stack: true,
        }), Winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }), logFormat),
        transports: [
            new Winston.transports.Console(),
            new winston_seq_1.SeqTransport({
                level: 'debug',
                serverUrl: 'http://127.0.0.1:5341',
                apiKey: 'O8lyxdRwWgOwlWLgvbid',
                onError: (e) => console.error(e),
            }),
        ],
    });
};
exports.logger = logger;
//# sourceMappingURL=logger.js.map