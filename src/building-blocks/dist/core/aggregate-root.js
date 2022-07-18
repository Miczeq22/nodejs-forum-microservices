"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregateRoot = void 0;
const entity_1 = require("./entity");
class AggregateRoot extends entity_1.Entity {
    constructor() {
        super(...arguments);
        this.domainEvents = [];
    }
    addDomainEvent(event) {
        this.domainEvents.push(event);
    }
    getDomainEvents() {
        return this.domainEvents;
    }
    clearDomainEvents() {
        this.domainEvents = [];
    }
}
exports.AggregateRoot = AggregateRoot;
//# sourceMappingURL=aggregate-root.js.map