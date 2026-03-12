import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { asString } from '../utils/asString';

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const unreadOnly = req.query.unreadOnly === 'true';

        const where: any = {};
        if (unreadOnly) {
            where.readAt = null;
        }

        const notifications = await prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 50 // Limit to last 50
        });

        // Get count of unread
        const unreadCount = await prisma.notification.count({
            where: { readAt: null }
        });

        res.json({
            data: notifications,
            unreadCount
        });
    } catch (error) {
        next(error);
    }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = asString(req.params.id) || asString(req.query.id);
        if (!id) return res.status(400).json({ message: 'Missing notification id' });

        const notification = await prisma.notification.update({
            where: { id },
            data: { readAt: new Date() }
        });
        res.json(notification);
    } catch (error) {
        next(error);
    }
};

export const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await prisma.notification.updateMany({
            where: { readAt: null },
            data: { readAt: new Date() }
        });
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
};
