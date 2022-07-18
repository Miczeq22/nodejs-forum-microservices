"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAsArray = void 0;
const registerAsArray = (resolvers) => {
    return {
        resolve: (container) => resolvers.map((resolver) => container.build(resolver)),
    };
};
exports.registerAsArray = registerAsArray;
//# sourceMappingURL=register-as-array.js.map