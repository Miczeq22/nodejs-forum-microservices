"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const prometheus_api_metrics_1 = __importDefault(require("prometheus-api-metrics"));
const http_status_1 = __importDefault(require("http-status"));
class Server {
    constructor(dependencies) {
        this.dependencies = dependencies;
        this.app = (0, express_1.default)();
        this.app.use(express_1.default.json());
        this.app.use((0, prometheus_api_metrics_1.default)());
        this.app.get('/health', (_, res) => {
            res.sendStatus(http_status_1.default.OK);
        });
        this.dependencies.controllers.forEach((controller) => this.app.use(controller.route, controller.getRouter()));
    }
    getApp() {
        return this.app;
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map