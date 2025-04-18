interface JwtPayload {
    userId: string;
}
/**
 * Generates a JWT access token.
 * @param payload - The payload to include in the token.
 * @returns The generated JWT string.
 */
export declare const generateAccessToken: (payload: JwtPayload) => string;
/**
 * Verifies a JWT access token.
 * @param token - The JWT string to verify.
 * @returns The decoded payload if the token is valid.
 * @throws JsonWebTokenError if the token is invalid or expired.
 */
export declare const verifyAccessToken: (token: string) => JwtPayload;
export {};
