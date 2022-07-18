"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProxyFromMock = exports.createMockProxy = void 0;
const __1 = require("..");
const createMockProxy = (objectName = 'mock') => {
    const cache = new Map();
    const handler = {
        get: (_, name) => {
            if (name === 'mockClear') {
                return () => cache.clear();
            }
            if (!cache.has(name)) {
                cache.set(name, jest.fn().mockName(`${objectName}.${String(name)}`));
            }
            return cache.get(name);
        },
    };
    return new Proxy({}, handler);
};
exports.createMockProxy = createMockProxy;
const createProxyFromMock = (mock) => {
    if (!jest.isMockFunction(mock)) {
        throw new __1.MyForumError(`Expected ${mock} to be a jest mock.`);
    }
    const proxy = (0, exports.createMockProxy)();
    mock.mockImplementation(() => proxy);
    return proxy;
};
exports.createProxyFromMock = createProxyFromMock;
//# sourceMappingURL=mock-proxy.js.map