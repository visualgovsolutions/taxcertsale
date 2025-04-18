import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload | string;
        }
    }
}
export declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const authorizeRole: (allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
