"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniqueEntityID = void 0;
const identifier_1 = require("./identifier");
const uuid_1 = require("uuid");
class UniqueEntityID extends identifier_1.Identifier {
    constructor(id) {
        super(id || (0, uuid_1.v4)());
    }
}
exports.UniqueEntityID = UniqueEntityID;
//# sourceMappingURL=unique-entity-id.js.map