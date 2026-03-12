import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { Role } from '@prisma/client';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: Role;
                tenantId?: string | null;
            };
        }
    }
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new Error('No token');

        const token = authHeader.split(' ')[1];
        if (!token) throw new Error('No token provided');

        const decoded = verifyToken(token) as any;

        // Ensure role is valid
        if (!decoded.role) throw new Error('Invalid token payload');

        req.user = decoded;
        next();
    } catch (e) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === Role.SUPER_ADMIN) {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Super Admin access required' });
    }
};

export const requireTenantAccess = (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (userRole === Role.SUPER_ADMIN || userRole === Role.TENANT_OWNER || userRole === Role.TENANT_USER) {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Tenant access required' });
    }
};

// Deprecated: Compatibility for old 'isAdmin' check, maps to SUPER_ADMIN for safety
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === Role.SUPER_ADMIN) {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Admins only' });
    }
};
