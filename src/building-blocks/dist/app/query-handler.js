"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeDataToPaginatedResponse = exports.DEFAULT_ITEMS_PER_PAGE = exports.DEFAULT_PAGE = void 0;
exports.DEFAULT_PAGE = 1;
exports.DEFAULT_ITEMS_PER_PAGE = 20;
const serializeDataToPaginatedResponse = (data, total, page, itemsPerPage) => ({
    data,
    total: Number(total),
    itemsPerPage: Number(itemsPerPage),
    currentPage: Number(page),
    maxPages: Math.ceil(Number(total) / Number(itemsPerPage)),
});
exports.serializeDataToPaginatedResponse = serializeDataToPaginatedResponse;
//# sourceMappingURL=query-handler.js.map