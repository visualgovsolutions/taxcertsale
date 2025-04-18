"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = __importDefault(require("../../config/index"));
const ACCESS_TOKEN_SECRET = index_1.default.jwt.secret;
const ACCESS_TOKEN_EXPIRES_IN = index_1.default.jwt.expiresIn || '1h'; // Default to 1 hour
/**
 * Generates a JWT access token.
 * @param payload - The payload to include in the token.
 * @returns The generated JWT string.
 */
const generateAccessToken = (payload) => {
    if (!ACCESS_TOKEN_SECRET) {
        throw new Error('JWT secret is not configured.');
    }
    return jsonwebtoken_1.default.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
};
exports.generateAccessToken = generateAccessToken;
/**
 * Verifies a JWT access token.
 * @param token - The JWT string to verify.
 * @returns The decoded payload if the token is valid.
 * @throws JsonWebTokenError if the token is invalid or expired.
 */
const verifyAccessToken = (token) => {
    if (!ACCESS_TOKEN_SECRET) {
        throw new Error('JWT secret is not configured.');
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
        return decoded;
    }
    catch (error) {
        console.error('JWT verification failed:', error);
        // Re-throw the original error to be handled by the caller
        throw error;
    }
};
exports.verifyAccessToken = verifyAccessToken;
// Placeholder for refresh token generation and verification
// We will implement these later as part of the refresh token system.
/*
export const generateRefreshToken = (payload: JwtPayload): string => {
  // Implementation needed (likely uses a different secret and longer expiry)
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  // Implementation needed
};
*/ 
//# sourceMappingURL=jwtUtils.js.map