"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = exports.authenticateToken = void 0;
const jwtUtils_1 = require("../utils/jwtUtils");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (token == null) {
        return res.status(401).json({ message: 'Authentication required: No token provided' });
    }
    try {
        const decoded = (0, jwtUtils_1.verifyAccessToken)(token);
        req.user = decoded; // Attach decoded payload (contains userId, etc.) to request
        return next(); // Add return here
    }
    catch (error) {
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
exports.authenticateToken = authenticateToken;
// Placeholder for Role-Based Access Control (RBAC) middleware
/*
export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || typeof req.user === 'string' || !req.user.role) {
      return res.status(403).json({ message: 'Forbidden: Role information missing' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: `Forbidden: Role '${req.user.role}' not authorized` });
    }
    next();
  };
};
*/
const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        // Check if user object and role property exist
        if (!req.user || typeof req.user === 'string' || !req.user.role) { // Type assertion for role access
            return res.status(403).json({ message: 'Forbidden: Role information missing or invalid in token' });
        }
        const userRole = req.user.role;
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: `Forbidden: Role '${userRole}' not authorized for this resource` });
        }
        return next(); // Add return here
    };
};
exports.authorizeRole = authorizeRole;
//# sourceMappingURL=authMiddleware.js.map