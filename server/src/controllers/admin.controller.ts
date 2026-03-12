import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { LeadStatus, ClientStatus, Role, Prisma, PlanTier, BillingCycle } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { firstString, requiredString } from '../utils/request.utils';

export const getDashboardMetrics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const totalLeads = await prisma.lead.count();
        const pendingLeads = await prisma.lead.count({ where: { status: LeadStatus.PENDING } });
        const convertedLeads = await prisma.lead.count({ where: { status: LeadStatus.CONVERTED } });

        // Helper to check TRIAL vs ACTIVE
        // Active Trials: Status ACTIVE/TRIAL + Plan FREE + fechaFin > now
        const activeTrialsCount = await prisma.tenant.count({
            where: {
                status: ClientStatus.ACTIVE,
                plan: PlanTier.FREE,
                fechaFin: { gt: new Date() }
            }
        });

        // Active Subscriptions: Status ACTIVE + Plan != FREE
        // OR Status ACTIVE + Plan FREE + No fechaFin (Permanent Free?) -> 
        // Let's assume Paid Subscriptions are those with Plan != FREE
        const activeSubscriptionsCount = await prisma.tenant.count({
            where: {
                status: ClientStatus.ACTIVE,
                plan: { not: PlanTier.FREE }
            }
        });

        const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0';

        const recentLeads = await prisma.lead.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { id: true, name: true, companyName: true, status: true, email: true, createdAt: true }
        });

        res.json({
            totalLeads,
            convertedLeads,
            conversionRatePercent: conversionRate,
            activeTrialsCount,
            activeSubscriptionsCount,
            recentLeads
        });
    } catch (error) {
        next(error);
    }
};

export const getSubscriptionClients = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tenants = await prisma.tenant.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                companyName: true,
                email: true,
                status: true,
                plan: true,
                modalidad: true,
                fechaFin: true,
                createdAt: true
            }
        });

        // Map to derived status for UI
        const data = tenants.map(t => {
            let derivedStatus = 'ACTIVE';
            const isTrialPlan = t.plan === PlanTier.FREE;
            if (isTrialPlan && t.fechaFin) {
                if (new Date() > t.fechaFin) {
                    derivedStatus = 'TRIAL_EXPIRED';
                } else {
                    derivedStatus = 'TRIAL';
                }
            } else if (t.status !== ClientStatus.ACTIVE) {
                derivedStatus = t.status; // SUSPENDED, CANCELLED, etc.
            }

            return {
                ...t,
                status: derivedStatus
            };
        });

        res.json(data);
    } catch (error) {
        next(error);
    }
};

export const getActivity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const recentLeads = await prisma.lead.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                companyName: true,
                status: true,
                createdAt: true,
                email: true
            }
        });
        res.json(recentLeads);
    } catch (error) {
        next(error);
    }
};

export const getTenants = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(firstString(req.query.page) || '1');
        const pageSize = parseInt(firstString(req.query.pageSize) || '10');
        const search = firstString(req.query.search) || '';

        const skip = (page - 1) * pageSize;

        const where: Prisma.TenantWhereInput = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { companyName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [tenants, total] = await Promise.all([
            prisma.tenant.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    users: {
                        select: { name: true, email: true, role: true } // Include users for context
                    }
                }
            }),
            prisma.tenant.count({ where })
        ]);

        res.json({
            data: tenants,
            pagination: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize)
            }
        });
    } catch (error) {
        next(error);
    }
};

export const activateClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { leadId, plan, billing, password, modal_year, modal_month } = req.body;

        if (!leadId || !plan || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const lead = await prisma.lead.findUnique({ where: { id: leadId } });
        if (!lead) return res.status(404).json({ message: 'Lead not found' });

        // Calculate Dates
        const startDate = new Date();
        const endDate = new Date();
        if (billing === 'ANNUAL') {
            endDate.setFullYear(startDate.getFullYear() + 1);
        } else {
            endDate.setMonth(startDate.getMonth() + 1);
        }

        // Hash Password
        const passwordHash = await bcrypt.hash(password, 10);

        // Transaction: Create Tenant, Create User, Update Lead
        const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // 1. Create Tenant
            const tenant = await tx.tenant.create({
                data: {
                    name: lead.companyName, // Use company name as tenant name
                    companyName: lead.companyName,
                    email: lead.email,
                    phone: lead.phoneWhatsapp,
                    status: ClientStatus.ACTIVE,
                    plan: plan,
                    modalidad: billing,
                    fechaInicio: startDate,
                    fechaFin: endDate,
                    // logoUrl & colors can be updated later
                }
            });

            // 2. Create Admin User for this Tenant
            const user = await tx.user.create({
                data: {
                    name: lead.name,
                    email: lead.email,
                    passwordHash,
                    role: Role.TENANT_OWNER,
                    tenantId: tenant.id
                }
            });

            // 3. Update Lead Status
            await tx.lead.update({
                where: { id: leadId },
                data: { status: LeadStatus.CONVERTED }
            });

            return { tenant, user };
        });

        res.json({ message: 'Client activated successfully', data: result });
    } catch (error) {
        next(error);
    }
};

// Helper to normalize Status
const normalizeStatus = (status: string): ClientStatus | undefined => {
    if (!status) return undefined;
    const s = status.toUpperCase();
    if (s === 'ACTIVO' || s === 'ACTIVE') return ClientStatus.ACTIVE;
    if (s === 'CANCELADO' || s === 'CANCELLED') return ClientStatus.CANCELLED;
    if (s === 'VENCIDO') return ClientStatus.VENCIDO;
    if (s === 'PENDIENTE' || s === 'PENDING') return ClientStatus.PENDING;
    if (s === 'PAUSADO' || s === 'SUSPENDIDO' || s === 'SUSPENDED') return ClientStatus.SUSPENDED;
    // Map TRIAL intent to ACTIVE for DB, but we handle logic separately
    if (s === 'TRIAL' || s === 'PRUEBA') return ClientStatus.ACTIVE;
    return undefined;
};

// Helper to normalize Plan
const normalizePlan = (plan: string): PlanTier | undefined => {
    if (!plan) return undefined;
    const p = plan.toUpperCase();
    if (p === 'GRATIS' || p === 'FREE') return PlanTier.FREE;
    if (p === 'BASICO' || p === 'BÁSICO' || p === 'BASIC') return PlanTier.BASIC;
    if (p === 'PREMIUM') return PlanTier.PREMIUM;
    if (p === 'VIP') return PlanTier.VIP;
    return undefined;
};

// Helper to normalize Billing
const normalizeBilling = (billing: string): BillingCycle | undefined => {
    if (!billing) return undefined;
    const b = billing.toUpperCase();
    if (b === 'MENSUAL' || b === 'MONTHLY') return BillingCycle.MONTHLY;
    if (b === 'ANUAL' || b === 'ANNUAL') return BillingCycle.ANNUAL;
    return undefined;
};

export const updateTenant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = requiredString(req.params.id, "id");
        const tenantId = id;
        const { status, plan, modalidad, fechaInicio, fechaFin } = req.body;

        const normalizedStatus = status ? normalizeStatus(status) : undefined;
        const normalizedPlan = plan ? normalizePlan(plan) : undefined;
        const normalizedBilling = modalidad ? normalizeBilling(modalidad) : undefined;

        // Validation
        if (status && !normalizedStatus) return res.status(400).json({ message: `Invalid status: ${status}` });
        if (plan && !normalizedPlan) return res.status(400).json({ message: `Invalid plan: ${plan}` });
        if (modalidad && !normalizedBilling) return res.status(400).json({ message: `Invalid billing: ${modalidad}` });

        const currentTenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
        if (!currentTenant) return res.status(404).json({ message: 'Tenant not found' });

        const dataToUpdate: any = {};
        let newPassword = null;

        // Check for TRIAL -> ACTIVE conversion (Password Rotation)
        const isActivatingFromTrial = (currentTenant.plan === 'FREE' || currentTenant.plan === 'BASIC') && normalizedStatus === ClientStatus.ACTIVE;

        if (normalizedStatus) dataToUpdate.status = normalizedStatus;

        if (normalizedStatus === ClientStatus.ACTIVE) {
            // Activating Logic
            const finalPlan = normalizedPlan || currentTenant.plan;
            const finalBilling = normalizedBilling || currentTenant.modalidad;

            if (!finalPlan) return res.status(400).json({ message: 'Plan required for activation' });
            if (!finalBilling) return res.status(400).json({ message: 'Billing cycle required for activation' });

            // Calculate Dates
            const startDate = fechaInicio ? new Date(fechaInicio) : new Date();
            let endDate = fechaFin ? new Date(fechaFin) : new Date(startDate);

            if (!fechaFin) {
                if (finalBilling === BillingCycle.ANNUAL) {
                    endDate.setFullYear(startDate.getFullYear() + 1);
                } else {
                    endDate.setMonth(startDate.getMonth() + 1);
                }
            }

            dataToUpdate.fechaInicio = startDate;
            dataToUpdate.fechaFin = endDate;
            dataToUpdate.plan = finalPlan;
            dataToUpdate.modalidad = finalBilling;

            // Rotate Password if coming from Trial
            if (isActivatingFromTrial) {
                newPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
                const passwordHash = await bcrypt.hash(newPassword, 10);

                await prisma.user.updateMany({
                    where: { tenantId, role: Role.TENANT_OWNER },
                    data: { passwordHash }
                });
            }
        } else {
            // Normal update
            if (normalizedPlan) dataToUpdate.plan = normalizedPlan;
            if (normalizedBilling) dataToUpdate.modalidad = normalizedBilling;
            if (fechaInicio) dataToUpdate.fechaInicio = new Date(fechaInicio);
            if (fechaFin) dataToUpdate.fechaFin = new Date(fechaFin);
        }

        const tenant = await prisma.tenant.update({
            where: { id: tenantId },
            data: dataToUpdate
        });

        res.json({
            message: 'Tenant updated successfully',
            tenant,
            newPassword: newPassword // Only returned if rotated
        });
    } catch (error) {
        next(error);
    }
};

export const convertLeadToTenant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = requiredString(req.params.id, "id");
        const { plan, billing, status } = req.body;

        const targetStatus = ClientStatus.ACTIVE;

        if (status !== 'TRIAL') {
            if (!plan || !billing) return res.status(400).json({ message: 'Plan and Billing are required for Active conversion' });
        }

        const leadId = id;
        const lead = await prisma.lead.findUnique({ where: { id: leadId } });
        if (!lead) return res.status(404).json({ message: 'Lead not found' });

        // Identify if this is a NEW creation or an UPGRADE
        const existingTenant = await prisma.tenant.findUnique({ where: { email: lead.email } });

        // --- 1. UPGRADE SCENARIO (Trial -> Active) ---
        if (existingTenant) {
            // Only allow upgrade if moving to ACTIVE and current is not already "PAID ACTIVE" (prevent accidental reset)
            // But user requirement is: "ALWAYS generate NEW password when moving from Trial/Gratis to Active"
            // We assume if calling this endpoint, the admin INTENDS to Upgrade/Reset.

            if (status === 'TRIAL') {
                return res.status(400).json({ message: 'Tenant already exists. Cannot create another Trial.' });
            }

            // Normalizing inputs
            const normalizedBilling = normalizeBilling(billing as string) || BillingCycle.MONTHLY;
            const normalizedPlan = normalizePlan(plan as string) || PlanTier.BASIC;

            // Dates
            const startDate = new Date();
            const endDate = new Date();
            if (normalizedBilling === BillingCycle.ANNUAL) {
                endDate.setFullYear(startDate.getFullYear() + 1);
            } else {
                endDate.setMonth(startDate.getMonth() + 1);
            }

            // Generate NEW Password for rotation
            const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const passwordHash = await bcrypt.hash(password, 10);

            // Execute Update
            await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
                // Update Tenant
                await tx.tenant.update({
                    where: { id: existingTenant.id },
                    data: {
                        status: ClientStatus.ACTIVE,
                        plan: normalizedPlan,
                        modalidad: normalizedBilling,
                        fechaInicio: startDate,
                        fechaFin: endDate,
                    }
                });

                // Rotate Password for Owner
                await tx.user.updateMany({
                    where: { tenantId: existingTenant.id, role: Role.TENANT_OWNER },
                    data: { passwordHash }
                });

                // Update Lead status
                await tx.lead.update({
                    where: { id: leadId },
                    data: { status: LeadStatus.CONVERTED, notes: `Upgraded to ACTIVE. Tenant ID: ${existingTenant.id}` }
                });

                // Audit
                const adminId = (req as any).user?.id;
                if (adminId) {
                    await tx.auditLog.create({
                        data: {
                            adminId,
                            action: 'LEAD_UPGRADED',
                            details: `Lead ${lead.email} upgraded to ACTIVE Tenant`
                        }
                    });
                }
            });

            // Return with NEW password
            return res.json({
                message: 'Client upgraded to Active successfully. Password rotated.',
                data: {
                    tenant: { ...existingTenant, status: ClientStatus.ACTIVE },
                    email: lead.email,
                    password: password, // Showing new password
                    trialEndsAt: undefined
                }
            });
        }

        // --- 2. NEW CREATION SCENARIO ---
        if (lead.status === LeadStatus.CONVERTED) {
            return res.status(400).json({ message: 'Lead is already converted' });
        }

        // Calculate Dates
        const startDate = new Date();
        const endDate = new Date();

        let normalizedBilling: BillingCycle = BillingCycle.MONTHLY;
        let normalizedPlan: PlanTier = PlanTier.FREE;

        if (status === 'TRIAL') {
            // Trial Logic: 14 days default
            endDate.setDate(startDate.getDate() + 14);
        } else {
            // Active Logic
            normalizedBilling = normalizeBilling(billing as string) || BillingCycle.MONTHLY;
            normalizedPlan = normalizePlan(plan as string) || PlanTier.BASIC;

            if (normalizedBilling === BillingCycle.ANNUAL) {
                endDate.setFullYear(startDate.getFullYear() + 1);
            } else {
                endDate.setMonth(startDate.getMonth() + 1);
            }
        }

        // Generate Password
        const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const passwordHash = await bcrypt.hash(password, 10);

        const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // 1. Create Tenant
            const tenant = await tx.tenant.create({
                data: {
                    name: lead.companyName,
                    companyName: lead.companyName,
                    email: lead.email,
                    phone: lead.phoneWhatsapp,
                    status: targetStatus,
                    plan: status === 'TRIAL' ? 'FREE' : normalizedPlan,
                    modalidad: normalizedBilling,
                    fechaInicio: startDate,
                    fechaFin: endDate,
                }
            });

            // 2. Create User
            const user = await tx.user.create({
                data: {
                    name: lead.name,
                    email: lead.email,
                    passwordHash,
                    role: Role.TENANT_OWNER,
                    tenantId: tenant.id
                }
            });

            // 3. Update Lead
            await tx.lead.update({
                where: { id: leadId },
                data: { status: LeadStatus.CONVERTED, notes: `Converted to ${status === 'TRIAL' ? 'TRIAL' : 'ACTIVE'} Tenant ID: ${tenant.id}` }
            });

            // 4. Audit Log
            const adminId = (req as any).user?.id;
            if (adminId) {
                await tx.auditLog.create({
                    data: {
                        adminId,
                        action: 'LEAD_CONVERTED',
                        details: `Lead ${lead.email} converted to ${status} Tenant`
                    }
                });
            }

            return { tenant, user, password };
        });

        res.json({
            message: `Lead converted to ${status === 'TRIAL' ? 'Trial' : 'Active'} successfully`,
            data: {
                tenant: result.tenant,
                email: result.user.email,
                password: result.password,
                trialEndsAt: status === 'TRIAL' ? endDate : undefined
            }
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// NOTIFICATIONS
// ==========================================

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notifications = await prisma.notification.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50 // Limit to last 50 for performance
        });

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

export const markNotificationRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = requiredString(req.params.id, "id");
        await prisma.notification.update({
            where: { id },
            data: { readAt: new Date() }
        });
        res.json({ message: 'Marked as read' });
    } catch (error) {
        next(error);
    }
};

export const markAllNotificationsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await prisma.notification.updateMany({
            where: { readAt: null },
            data: { readAt: new Date() }
        });
        res.json({ message: 'All marked as read' });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// SYSTEM CONFIGURATION
// ==========================================

export const getSystemConfig = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const configs = await prisma.systemConfig.findMany();
        // Convert array to object
        const configMap = configs.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, any>);
        res.json(configMap);
    } catch (error) {
        next(error);
    }
};

export const updateSystemConfig = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { key, value } = req.body;
        if (!key) return res.status(400).json({ message: 'Key is required' });

        const config = await prisma.systemConfig.upsert({
            where: { key },
            update: { value },
            create: { key, value }
        });

        res.json({ message: 'Config updated', config });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// PLAN MANAGEMENT
// ==========================================

// ==========================================
// PLAN MANAGEMENT
// ==========================================

export const getPlans = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const plans = await prisma.plan.findMany({
            orderBy: { priceMonthly: 'asc' }
        });
        res.json(plans);
    } catch (error) {
        next(error);
    }
};

export const updatePlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tier = firstString(req.params.tier ?? req.query.tier ?? req.body.tier);
        const { displayName, priceMonthly, priceAnnual, features, limits, isActive } = req.body;

        if (!tier) return res.status(400).json({ message: 'Plan Tier is required' });

        const normalizedTier = normalizePlan(tier); // Reuse existing helper
        if (!normalizedTier) return res.status(400).json({ message: 'Invalid Plan Tier' });

        // Upsert allows "Creating" active/inactive plans for the UI
        const plan = await prisma.plan.upsert({
            where: { tier: normalizedTier },
            update: {
                displayName,
                priceMonthly: parseInt(priceMonthly),
                priceAnnual: parseInt(priceAnnual),
                features,
                limits,
                isActive
            },
            create: {
                tier: normalizedTier,
                displayName: displayName || tier,
                priceMonthly: parseInt(priceMonthly) || 0,
                priceAnnual: parseInt(priceAnnual) || 0,
                features: features || [],
                limits: limits || {},
                isActive: isActive !== undefined ? isActive : true
            }
        });

        res.json({ message: 'Plan updated', plan });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// REPORTS
// ==========================================

export const getReportConversion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const range = firstString(req.query.range) || '30d';
        const now = new Date();
        const startDate = new Date();

        if (range === '90d') startDate.setDate(now.getDate() - 90);
        else if (range === '365d') startDate.setDate(now.getDate() - 365);
        else startDate.setDate(now.getDate() - 30); // Default 30d

        const totalLeads = await prisma.lead.count({
            where: { createdAt: { gte: startDate } }
        });
        const convertedLeads = await prisma.lead.count({
            where: {
                status: LeadStatus.CONVERTED,
                createdAt: { gte: startDate }
            }
        });

        const conversionRatePercent = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0';

        // Group by date for chart
        // Note: Prisma does not support date_trunc easily across DBs without raw query.
        // For simplicity/compatibility, fetching all and grouping in JS. 
        // In high scale, use raw SQL or specialized analytics DB.
        const leads = await prisma.lead.findMany({
            where: { createdAt: { gte: startDate } },
            select: { createdAt: true, status: true }
        });

        const seriesMap = new Map<string, { leads: number, converted: number }>();

        // Initialize map with 0s for all days in range to ensure continuous chart
        for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
            const dayStr = d.toISOString().split('T')[0];
            seriesMap.set(dayStr, { leads: 0, converted: 0 });
        }

        leads.forEach(l => {
            const dayStr = l.createdAt.toISOString().split('T')[0];
            if (seriesMap.has(dayStr)) {
                const entry = seriesMap.get(dayStr)!;
                entry.leads++;
                if (l.status === LeadStatus.CONVERTED) entry.converted++;
            }
        });

        const series = Array.from(seriesMap.entries()).map(([date, counts]) => ({
            date,
            leads: counts.leads,
            converted: counts.converted
        })).sort((a, b) => a.date.localeCompare(b.date));

        res.json({
            range,
            totals: {
                totalLeads,
                convertedLeads,
                conversionRatePercent
            },
            series
        });
    } catch (error) {
        next(error);
    }
};

export const getReportSubscriptions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const range = firstString(req.query.range) || '30d';

        // This report shows CURRENT snapshot mostly, but series needs history. 
        // Without a robust "Event Store" or "History Table", recreating historical active subs is hard.
        // For this MVP, we will return:
        // Totals: Current Snapshot
        // Series: CreatedAt of Active vs Cancelled vs Trial tenants in the range.

        const now = new Date();
        const startDate = new Date();
        if (range === '90d') startDate.setDate(now.getDate() - 90);
        else if (range === '365d') startDate.setDate(now.getDate() - 365);
        else startDate.setDate(now.getDate() - 30);

        // Snapshot Totals
        const active = await prisma.tenant.count({
            where: { status: ClientStatus.ACTIVE }
        });
        const trialsActive = await prisma.tenant.count({
            where: {
                status: ClientStatus.ACTIVE,
                plan: PlanTier.FREE,
                fechaFin: { gt: now }
            }
        });
        const trialsExpired = await prisma.tenant.count({
            where: {
                plan: PlanTier.FREE,
                fechaFin: { lte: now }
            }
        });
        const canceled = await prisma.tenant.count({
            where: { status: ClientStatus.CANCELLED }
        });

        // Series: New Tenants over time by type
        const tenants = await prisma.tenant.findMany({
            where: { createdAt: { gte: startDate } },
            select: { createdAt: true, status: true, plan: true, fechaFin: true }
        });

        const seriesMap = new Map<string, { active: number, trials: number, canceled: number }>();
        for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
            seriesMap.set(d.toISOString().split('T')[0], { active: 0, trials: 0, canceled: 0 });
        }

        tenants.forEach(t => {
            const dayStr = t.createdAt.toISOString().split('T')[0];
            if (seriesMap.has(dayStr)) {
                const entry = seriesMap.get(dayStr)!;
                if (t.status === ClientStatus.CANCELLED) {
                    entry.canceled++;
                } else if (t.plan === PlanTier.FREE) {
                    entry.trials++;
                } else {
                    entry.active++;
                }
            }
        });

        const series = Array.from(seriesMap.entries()).map(([date, counts]) => ({
            date,
            ...counts
        })).sort((a, b) => a.date.localeCompare(b.date));

        res.json({
            range,
            totals: { active, trialsActive, trialsExpired, canceled },
            series
        });

    } catch (error) {
        next(error);
    }
};

export const getReportRevenue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const range = firstString(req.query.range) || '30d';

        // Manual Price Map
        const PRICES = {
            [PlanTier.FREE]: 0,
            [PlanTier.BASIC]: 49,
            [PlanTier.PREMIUM]: 99,
            [PlanTier.VIP]: 199 // Assumption if VIP exists
        };

        const tenants = await prisma.tenant.findMany({
            where: {
                status: ClientStatus.ACTIVE,
                plan: { not: PlanTier.FREE }
            },
            select: { plan: true, modalidad: true }
        });

        let mrr = 0;
        tenants.forEach(t => {
            const price = PRICES[t.plan as PlanTier] || 0;
            if (t.modalidad === BillingCycle.MONTHLY) {
                mrr += price;
            } else if (t.modalidad === BillingCycle.ANNUAL) {
                mrr += (price); // Usually annual price is discounted, but strict Req said: add planPriceAnnual/12
                // Let's assume price map is monthly base.
                // MRR = Monthly Price.
                // If they paid Annual, usually it's e.g. 10 * MonthlyPrice.
                // Req: "For ANNUAL active clients: add planPriceAnnual/12 (or planPriceMonthly*0.9)"
                // We'll use price * 0.9 for Annual MRR contribution per month
                mrr += (price * 0.9);
            }
        });

        const arr = mrr * 12;

        // Series: Revenue growth? 
        // For MVP, flat line or simple projection isn't real data. 
        // Let's show "New Revenue Added" by day based on creations.

        const now = new Date();
        const startDate = new Date();
        if (range === '90d') startDate.setDate(now.getDate() - 90);
        else if (range === '365d') startDate.setDate(now.getDate() - 365);
        else startDate.setDate(now.getDate() - 30);

        const newTenants = await prisma.tenant.findMany({
            where: {
                createdAt: { gte: startDate },
                status: ClientStatus.ACTIVE,
                plan: { not: PlanTier.FREE }
            },
            select: { createdAt: true, plan: true, modalidad: true }
        });

        const seriesMap = new Map<string, { mrr: number }>();
        for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
            seriesMap.set(d.toISOString().split('T')[0], { mrr: 0 });
        }

        // Calculate cumulative MRR for the chart? Or just new MRR?
        // Req: "line chart of MRR". usually implies total MRR over time.
        // Reconstructing historical MRR is hard without audit logs of upgrades/downgrades.
        // We will fake "Cumulative" by starting at (Current Total - Sum of New) and adding up.
        // Or just show "New MRR acquired".
        // Let's go with "Estimated Total MRR" assuming constant churn for simplicity or just show NEW MRR.
        // Better: Show "New MRR" per day to be accurate, rather than guessing Total MRR history.

        newTenants.forEach(t => {
            const dayStr = t.createdAt.toISOString().split('T')[0];
            if (seriesMap.has(dayStr)) {
                const price = PRICES[t.plan as PlanTier] || 0;
                let val = 0;
                if (t.modalidad === BillingCycle.MONTHLY) val = price;
                else val = price * 0.9;

                seriesMap.get(dayStr)!.mrr += val;
            }
        });

        const series = Array.from(seriesMap.entries()).map(([date, counts]) => ({
            date,
            mrr: counts.mrr,
            arr: counts.mrr * 12
        })).sort((a, b) => a.date.localeCompare(b.date));

        res.json({
            range,
            totals: { mrr, arr },
            series
        });

    } catch (error) {
        next(error);
    }
};
