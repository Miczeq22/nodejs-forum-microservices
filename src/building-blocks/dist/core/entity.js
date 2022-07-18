"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const unique_entity_id_1 = require("./unique-entity-id");
const business_rule_validation_error_1 = require("../errors/business-rule-validation.error");
const async_function_1 = require("../tools/async-function");
class Entity {
    constructor(props, id = new unique_entity_id_1.UniqueEntityID()) {
        this.props = props;
        this.id = id;
    }
    static checkRule(rule, ErrorType = business_rule_validation_error_1.BusinessRuleValidationError) {
        if (rule.isBroken instanceof Promise || rule.isBroken instanceof async_function_1.AsyncFunction) {
            return rule.isBroken().then((isBroken) => {
                if (isBroken) {
                    throw new ErrorType(rule.message);
                }
            });
        }
        if (rule.isBroken()) {
            throw new ErrorType(rule.message);
        }
    }
    equals(object) {
        if (!object) {
            return false;
        }
        if (!(object instanceof Entity)) {
            return false;
        }
        return object.id.equals(this.id);
    }
}
exports.Entity = Entity;
//# sourceMappingURL=entity.js.map