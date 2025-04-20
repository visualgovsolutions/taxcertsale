import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwtUtils';
import { JwtPayload } from 'jsonwebtoken';

// Extend Express Request type to include user payload with role as string
// eslint-disable-next-line @typescript-eslint/no-explicit-any

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      userId: string;
      email: string;
      role: string; // Role is now a string
      firstName?: string;
      lastName?: string;
    };
  }
}

/**
 * Middleware to authenticate requests with JWT
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.status(401).json({ message: 'Authentication required: No token provided' });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // Attach decoded payload (contains userId, role, etc.) to request
    return next();
  } catch (error) {
    // Handle specific JWT errors
    if (error instanceof Error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Unauthorized: Token expired' });
        } 
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
    }
    // Generic error for other issues
    console.error('Authentication error:', error);
    return res.status(403).json({ message: 'Forbidden: Token validation failed' });
  }
};

/**
 * Middleware for role-based access control
 * @param allowedRoles - Array of roles (strings) permitted to access the resource
 */
export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if user object and role property exist
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Forbidden: Role information missing or invalid in token' });
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: `Forbidden: Access denied. Required roles: ${allowedRoles.join(', ')}` 
      });
    }
    return next();
  };
};

/**
 * Middleware to check if the user is accessing their own resource
 * Requires the request to have a userId parameter
 */
export const authorizeOwnership = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(403).json({ message: 'Forbidden: Authentication required' });
  }

  const resourceUserId = req.params.userId || req.body.userId;
  if (!resourceUserId) {
    return res.status(400).json({ message: 'Bad Request: Resource user ID is required' });
  }

  // Allow admins to access any user's resources
  if (req.user.role === 'admin') {
    return next();
  }

  // Check if user is accessing their own resource
  if (req.user.userId !== resourceUserId) {
    return res.status(403).json({ message: 'Forbidden: You can only access your own resources' });
  }

  return next();
};

/**
 * Middleware that combines role and ownership checks
 * @param allowedRoles - Array of roles (strings) that can access any resource
 * @param allowOwnership - Whether to allow users to access their own resources
 */
export const authorizeRoleOrOwnership = (allowedRoles: string[], allowOwnership: boolean = true) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(403).json({ message: 'Forbidden: Authentication required' });
    }

    // If user has one of the allowed roles, grant access
    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    // If ownership check is enabled and resource belongs to user, grant access
    if (allowOwnership) {
      const resourceUserId = req.params.userId || req.body.userId;
      
      if (resourceUserId && req.user.userId === resourceUserId) {
        return next();
      }
    }

    // Otherwise deny access
    return res.status(403).json({ 
      message: `Forbidden: Insufficient permissions. Required roles: ${allowedRoles.join(', ')}` 
    });
  };
}; 