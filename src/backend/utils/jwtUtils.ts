import jwt from 'jsonwebtoken';
import config from '@config/index';

interface JwtPayload {
  userId: string; // Or ObjectId, depending on your User model
  // Add other relevant claims like role, email, etc. as needed
  // role?: string;
}

const ACCESS_TOKEN_SECRET = config.jwt.secret;
const ACCESS_TOKEN_EXPIRES_IN = config.jwt.expiresIn || '1h'; // Default to 1 hour

/**
 * Generates a JWT access token.
 * @param payload - The payload to include in the token.
 * @returns The generated JWT string.
 */
export const generateAccessToken = (payload: JwtPayload): string => {
  if (!ACCESS_TOKEN_SECRET) {
    throw new Error('JWT secret is not configured.');
  }
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
};

/**
 * Verifies a JWT access token.
 * @param token - The JWT string to verify.
 * @returns The decoded payload if the token is valid.
 * @throws JsonWebTokenError if the token is invalid or expired.
 */
export const verifyAccessToken = (token: string): JwtPayload => {
  if (!ACCESS_TOKEN_SECRET) {
    throw new Error('JWT secret is not configured.');
  }
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    // Re-throw the original error to be handled by the caller
    throw error;
  }
};

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