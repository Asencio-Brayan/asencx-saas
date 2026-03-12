import { z } from 'zod';

export const createLeadSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    companyName: z.string().min(1, 'Company name is required'),
    email: z.string().email('Invalid email address'),
    phoneWhatsapp: z.string().min(1, 'WhatsApp number is required'),
    systemType: z.enum(['ACADEMY', 'STORE', 'RESTAURANT', 'RESERVATIONS', 'HOTEL', 'OTHER']),
    trialDays: z.union([z.literal(7), z.literal(14)]),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
