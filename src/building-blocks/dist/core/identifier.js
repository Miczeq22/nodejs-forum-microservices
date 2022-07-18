"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Identifier = void 0;
class Identifier {
    constructor(value) {
        this.value = value;
    }
    equals(id) {
        if (!id) {
            return false;
        }
        if (!(id instanceof Identifier)) {
            return false;
        }
        return id.value === this.value;
    }
}
exports.Identifier = Identifier;
//# sourceMappingURL=identifier.js.map