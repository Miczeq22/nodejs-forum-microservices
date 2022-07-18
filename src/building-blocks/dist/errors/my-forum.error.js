"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyForumError = void 0;
class MyForumError extends Error {
    constructor(message, name = 'AppError', errorCode = 500) {
        super(message);
        this.message = message;
        this.name = name;
        this.errorCode = errorCode;
        Error.captureStackTrace(this, MyForumError.captureStackTrace);
    }
    toString() {
        return `Error: ${this.name} | ${this.message}`;
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            errorCode: this.errorCode,
        };
    }
}
exports.MyForumError = MyForumError;
//# sourceMappingURL=my-forum.error.js.map