"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueObject = void 0;
const business_rule_validation_error_1 = require("../errors/business-rule-validation.error");
const async_function_1 = require("../tools/async-function");
class ValueObject {
    constructor(props) {
        this.props = props;
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
        if (!(object instanceof ValueObject)) {
            return false;
        }
        return JSON.stringify(this.props) === JSON.stringify(object.props);
    }
}
exports.ValueObject = ValueObject;
//# sourceMappingURL=value-object.js.map