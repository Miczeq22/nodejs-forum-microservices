"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const my_forum_error_1 = require("./my-forum.error");
class NotFoundError extends my_forum_error_1.MyForumError {
    constructor(message = 'Not Found.') {
        super(message, 'NotFoundError', 422);
    }
}
exports.NotFoundError = NotFoundError;
//# sourceMappingURL=not-found.error.js.map