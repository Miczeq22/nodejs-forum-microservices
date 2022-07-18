"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceAlreadyExistsError = void 0;
const my_forum_error_1 = require("./my-forum.error");
class ResourceAlreadyExistsError extends my_forum_error_1.MyForumError {
    constructor(message = 'Resource Already Exists.') {
        super(message, 'ResourceAlreadyExistsError', 409);
    }
}
exports.ResourceAlreadyExistsError = ResourceAlreadyExistsError;
//# sourceMappingURL=resource-already-exists.error.js.map