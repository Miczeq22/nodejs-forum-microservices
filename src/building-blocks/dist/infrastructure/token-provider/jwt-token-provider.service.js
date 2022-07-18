"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtTokenProviderService = void 0;
const unauthorized_error_1 = require("../../errors/unauthorized.error");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtTokenProviderService {
    generateToken(payload, expiresIn = '1h', secret = process.env.JWT_SERVICE_SECRET) {
        return jsonwebtoken_1.default.sign(payload, secret, {
            expiresIn,
        });
    }
    verifyAndDecodeToken(token, secret = process.env.JWT_SERVICE_SECRET) {
        try {
            const payload = jsonwebtoken_1.default.verify(token, secret);
            return payload;
        }
        catch (_a) {
            throw new unauthorized_error_1.UnauthorizedError();
        }
    }
    decodeToken(token) {
        const payload = jsonwebtoken_1.default.decode(token);
        return payload;
    }
}
exports.JwtTokenProviderService = JwtTokenProviderService;
//# sourceMappingURL=jwt-token-provider.service.js.map