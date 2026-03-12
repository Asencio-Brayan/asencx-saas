import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { Role } from '@prisma/client';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const passwordHash = await hashPassword(password);
        const user = await prisma.user.create({
            data: { name, email, passwordHash, role: Role.TENANT_OWNER },
        });

        const token = generateToken({ id: user.id, role: user.role });
        res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await comparePassword(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken({ id: user.id, role: user.role });

        // Tenant checks
        if (user.role === Role.TENANT_OWNER || user.role === Role.TENANT_USER) {
            // Fetch tenant status to check for Trial Expiry
            const tenant = await prisma.tenant.findUnique({ where: { id: user.tenantId! } });
            if (tenant) {
                // Universal Expiry Check: If date is set and passed, deny.
                if (tenant.fechaFin && new Date() > new Date(tenant.fechaFin)) {
                    return res.status(403).json({
                        message: "Subscription or Trial expired. Please contact admin."
                    });
                }
            }
        }

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        next(error);
    }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        next(error);
    }
};
