"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthenticatedError = void 0;
const my_forum_error_1 = require("./my-forum.error");
class UnauthenticatedError extends my_forum_error_1.MyForumError {
    constructor(message = 'Unauthenticated.') {
        super(message, 'UnauthenticatedError', 403);
    }
}
exports.UnauthenticatedError = UnauthenticatedError;
//# sourceMappingURL=unauthenticated.error.js.map