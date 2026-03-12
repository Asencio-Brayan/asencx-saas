import { Router } from 'express';
import { getPlans } from '../controllers/admin.controller';
import { startCheckout, payCheckout, createWhatsAppCheckout } from '../controllers/checkout.controller';

const router = Router();

// Public Plans
router.get('/plans', getPlans);

// Checkout
router.post('/checkout/start', startCheckout);
router.post('/checkout/pay', payCheckout);

// WhatsApp Checkout
router.post('/whatsapp-checkout/create', createWhatsAppCheckout);

export default router;
