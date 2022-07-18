"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronJob = void 0;
const node_schedule_1 = __importDefault(require("node-schedule"));
class CronJob {
    constructor(cronPattern) {
        this.cronPattern = cronPattern;
    }
    setupJob() {
        node_schedule_1.default.scheduleJob(this.cronPattern, this.handle.bind(this));
    }
}
exports.CronJob = CronJob;
//# sourceMappingURL=cron-job.js.map