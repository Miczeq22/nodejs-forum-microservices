"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputValidationError = void 0;
const my_forum_error_1 = require("./my-forum.error");
class InputValidationError extends my_forum_error_1.MyForumError {
    constructor(message = 'Input Validation Error.') {
        super(message, 'InputValidationError', 422);
    }
}
exports.InputValidationError = InputValidationError;
//# sourceMappingURL=input-validation.error.js.map