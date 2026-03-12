
import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { z } from 'zod';
import { LeadStatus, ClientStatus } from '@prisma/client';
import { buildTenantWhere } from '../utils/tenant';
import { firstString, requiredString } from '../utils/request.utils';

const leadSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    companyName: z.string().min(1, 'Company name is required'),
    email: z.string().email(),
    phoneWhatsapp: z.string().optional(),
});

export const createLead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = leadSchema.parse(req.body);

        // Check for existing email
        const existingLead = await prisma.lead.findUnique({ where: { email: data.email } });
        if (existingLead) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }

        const lead = await prisma.lead.create({
            data: {
                ...data,
                status: LeadStatus.PENDING,
            }
        });

        res.status(201).json(lead);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation error', errors: error.issues });
        }
        next(error);
    }
};

export const getLeads = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(firstString(req.query.page) || '1');
        const pageSize = parseInt(firstString(req.query.pageSize) || '10');
        const search = firstString(req.query.search);
        const status = firstString(req.query.status);

        // Isolate Query
        // @ts-ignore
        const user = req.user;
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        const skip = (page - 1) * pageSize;

        let where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { companyName: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (status && status !== 'ALL') {
            // Validate status against enum
            if (Object.values(LeadStatus).includes(status as LeadStatus)) {
                where.status = status as LeadStatus;
            }
        }

        const isolatedWhere = buildTenantWhere(user, where);

        if (user.role !== 'SUPER_ADMIN') {
            // Tenants cannot see Global Leads
            return res.json({
                data: [],
                pagination: { total: 0, page, pageSize, totalPages: 0 }
            });
        }

        const [leads, checkouts, totalLeads] = await Promise.all([
            prisma.lead.findMany({
                where: isolatedWhere, // Works because SUPER_ADMIN returns baseWhere (no tenantId filter)
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' }
            }),
            page === 1 ? prisma.checkoutRequest.findMany({
                where: { status: 'PENDING_PAYMENT' },
                orderBy: { createdAt: 'desc' }
            }) : Promise.resolve([]),
            prisma.lead.count({ where: isolatedWhere })
        ]);

        const mappedCheckouts = checkouts.map(c => ({
            id: c.id,
            name: c.fullName + " (WSP Checkout)",
            companyName: c.company,
            email: c.email,
            phoneWhatsapp: c.whatsapp,
            status: "PENDING_PAYMENT" as any,
            notes: `Plan: ${c.planName} (${c.billingCycle}) - $${c.amountUsd}`,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt
        }));

        const combinedLeads = [...mappedCheckouts, ...leads].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        const total = totalLeads + (page === 1 ? checkouts.length : 0);

        res.json({
            data: combinedLeads,
            pagination: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(totalLeads / pageSize) || 1
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getLead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = requiredString(req.params.id, "id");

        // @ts-ignore
        const user = req.user;
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        // Same logic: Leads are platform-owned.
        if (user.role !== 'SUPER_ADMIN') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const lead = await prisma.lead.findUnique({ where: { id } });
        if (!lead) return res.status(404).json({ message: 'Lead not found' });
        res.json(lead);
    } catch (error) {
        next(error);
    }
};

export const updateLead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = requiredString(req.params.id, "id");

        // @ts-ignore
        const user = req.user;
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        // Same logic: Leads are platform-owned.
        if (user.role !== 'SUPER_ADMIN') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const {
            name, companyName, email, phoneWhatsapp, status, notes
        } = req.body;

        // Validate status if present
        if (status) {
            if (!Object.values(LeadStatus).includes(status as LeadStatus)) {
                return res.status(400).json({
                    message: `Invalid status. Valid values are: ${Object.values(LeadStatus).join(', ')}`
                });
            }
        }

        const lead = await prisma.lead.update({
            where: { id },
            data: {
                name, companyName, email, phoneWhatsapp,
                status: status ? (status as LeadStatus) : undefined,
                notes
            }
        });

        // ===============================================
        // PART B: AUTO SYNC STATUS FROM LEADS TO TENANTS
        // ===============================================
        if (status) {
            // Try to find a tenant with this email
            const tenant = await prisma.tenant.findUnique({ where: { email: lead.email } });

            if (tenant) {
                let newTenantStatus: ClientStatus | undefined;
                let updateData: any = {};

                // Map LeadStatus to ClientStatus
                switch (status as LeadStatus) {
                    case LeadStatus.CONVERTED:
                        // Ensure tenant is ACTIVE. 
                        // If it was VENCIDO or CANCELLED, revive it? 
                        // User says: "Ensure tenant is ACTIVE... Ensure subscription dates are valid"
                        newTenantStatus = 'ACTIVE'; // ClientStatus (enum string matching) as any
                        // Fix dates if they are missing or past?
                        // If we are just "syncing status", we might not want to magically extend subscription 
                        // without payment logic, but let's ensure it's not immediately expired if ACTIVE.
                        // However, strictly syncing status:
                        updateData.status = 'ACTIVE';
                        break;

                    case LeadStatus.LOST:
                        // Map LOST -> CANCELLED
                        newTenantStatus = 'CANCELLED'; // or ClientStatus.CANCELLED
                        updateData.status = 'CANCELLED';
                        break;

                    // We don't map PENDING or TRIAL strictly here via PATCH 
                    // because TRIAL usually involves date setting (handled in Convert/Upgrade).
                }

                if (updateData.status) {
                    await prisma.tenant.update({
                        where: { id: tenant.id },
                        data: {
                            status: updateData.status as ClientStatus
                        }
                    });
                }
            }
        }

        res.json(lead);
    } catch (error) {
        next(error);
    }
};

export const deleteLead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = requiredString(req.params.id, "id");

        // @ts-ignore
        const user = req.user;
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        // Same logic: Leads are platform-owned.
        if (user.role !== 'SUPER_ADMIN') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const lead = await prisma.lead.findUnique({ where: { id } });
        if (!lead) return res.status(404).json({ message: 'Lead not found' });

        // Check for associated Tenant
        const tenant = await prisma.tenant.findUnique({ where: { email: lead.email } });

        await prisma.$transaction(async (tx) => {
            if (tenant) {
                // Delete associated Users first (relation to Tenant)
                await tx.user.deleteMany({ where: { tenantId: tenant.id } });

                // Delete Tenant
                await tx.tenant.delete({ where: { id: tenant.id } });
            }

            // Delete Lead
            await tx.lead.delete({ where: { id } });
        });

        res.status(200).json({ message: 'Lead and associated data deleted successfully' });
    } catch (error) {
        next(error);
    }
};
