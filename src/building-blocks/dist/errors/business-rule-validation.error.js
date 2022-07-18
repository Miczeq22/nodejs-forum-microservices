"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessRuleValidationError = void 0;
const my_forum_error_1 = require("./my-forum.error");
class BusinessRuleValidationError extends my_forum_error_1.MyForumError {
    constructor(message) {
        super(message, 'BusinessRuleValidationError', 400);
    }
}
exports.BusinessRuleValidationError = BusinessRuleValidationError;
//# sourceMappingURL=business-rule-validation.error.js.map