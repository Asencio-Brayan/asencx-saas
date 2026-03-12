
import { Role } from '@prisma/client';

export interface UserPayload {
    id: string;
    role: Role;
    tenantId?: string | null;
}

/**
 * Builds a Prisma 'where' clause that enforces tenant isolation.
 * 
 * @param user The authenticated user payload
 * @param baseWhere Optional base 'where' clause to extend
 * @returns A strictly isolated 'where' clause
 */
export const buildTenantWhere = (user: UserPayload, baseWhere: any = {}) => {
    // 1. SUPER_ADMIN has global access (no filter added)
    if (user.role === Role.SUPER_ADMIN) {
        return baseWhere;
    }

    // 2. TENANT_* roles MUST be filtered by tenantId
    if (user.tenantId) {
        return {
            ...baseWhere,
            OR: [
                { tenantId: user.tenantId },
                // For models like Tenant itself, filter by ID
                { id: user.tenantId }
            ]
        };
    }

    // 3. If user has no tenantId and is not SUPER_ADMIN, deny access (safe fallback)
    // This returns a condition that will match nothing (e.g. id = "00000")
    return { ...baseWhere, id: '__NO_ACCESS__' };
};

/**
 * Simplified version specifically for models that have a direct `tenantId` field.
 */
export const whereTenant = (user: UserPayload) => {
    if (user.role === Role.SUPER_ADMIN) return {};
    if (!user.tenantId) return { tenantId: '__NO_ACCESS__' };
    return { tenantId: user.tenantId };
};

/**
 * Simplified version specifically for the Tenant model itself (where ID matches).
 */
export const whereTenantId = (user: UserPayload) => {
    if (user.role === Role.SUPER_ADMIN) return {};
    if (!user.tenantId) return { id: '__NO_ACCESS__' };
    return { id: user.tenantId };
};
