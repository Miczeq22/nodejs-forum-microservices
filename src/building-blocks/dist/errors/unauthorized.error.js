"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = void 0;
const my_forum_error_1 = require("./my-forum.error");
class UnauthorizedError extends my_forum_error_1.MyForumError {
    constructor(message = 'Unauthorized.') {
        super(message, 'UnauthorizedError', 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
//# sourceMappingURL=unauthorized.error.js.map