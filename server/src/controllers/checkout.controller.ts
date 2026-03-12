import { Request, Response } from 'express';
import { PrismaClient, BillingCycle } from '@prisma/client';

const prisma = new PrismaClient();

export const startCheckout = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fullName, company, whatsapp, email, industry, notes, planName, billingCycle, amountUsd } = req.body;

        // Basic validation
        if (!fullName || !company || !whatsapp || !email || !industry || !planName || !billingCycle || amountUsd === undefined) {
            res.status(400).json({ error: 'Faltan campos obligatorios' });
            return;
        }

        // Store request
        const checkoutRequest = await prisma.checkoutRequest.create({
            data: {
                fullName,
                company,
                whatsapp,
                email,
                industry,
                notes,
                planName,
                billingCycle: billingCycle as BillingCycle,
                amountUsd: parseFloat(amountUsd.toString()),
                status: 'PENDING'
            }
        });

        res.status(201).json({
            checkoutRequestId: checkoutRequest.id,
            amountUsd: checkoutRequest.amountUsd
        });
    } catch (error) {
        console.error('Error starting checkout:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const payCheckout = async (req: Request, res: Response): Promise<void> => {
    try {
        const { checkoutRequestId } = req.body;

        if (!checkoutRequestId) {
            res.status(400).json({ error: 'checkoutRequestId is required' });
            return;
        }

        // Update status to PAID (STUB FOR NOW)
        const updatedRequest = await prisma.checkoutRequest.update({
            where: { id: checkoutRequestId },
            data: { status: 'PAID' }
        });

        // In the future, here it would return a Stripe session URL: { redirectUrl: "..." }
        res.status(200).json({
            success: true,
            message: 'Pago simulado con éxito',
            data: updatedRequest
        });
    } catch (error) {
        console.error('Error paying checkout:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const createWhatsAppCheckout = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fullName, company, whatsapp, email, industry, notes, planName, billingCycle, amountUsd } = req.body;

        if (!fullName || !company || !whatsapp || !email || !industry || !planName || !billingCycle || amountUsd === undefined) {
            res.status(400).json({ error: 'Faltan campos obligatorios' });
            return;
        }

        const checkoutRequest = await prisma.checkoutRequest.create({
            data: {
                fullName,
                company,
                whatsapp,
                email,
                industry,
                notes,
                planName,
                billingCycle: billingCycle as BillingCycle,
                amountUsd: parseFloat(amountUsd.toString()),
                status: 'PENDING_PAYMENT',
                source: 'WHATSAPP_CHECKOUT'
            }
        });

        res.status(201).json({
            checkoutRequestId: checkoutRequest.id,
            amountUsd: checkoutRequest.amountUsd
        });
    } catch (error) {
        console.error('Error in whatsapp checkout:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
