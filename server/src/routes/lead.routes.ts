import { Router } from 'express';
import { createLead, getLeads } from '../controllers/lead.controller';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', createLead);
router.get('/', isAuthenticated, isAdmin, getLeads);

export default router;
