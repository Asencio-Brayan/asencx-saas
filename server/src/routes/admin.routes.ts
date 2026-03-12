import { Router } from 'express';
import { isAuthenticated, requireSuperAdmin } from '../middlewares/auth.middleware';
import {
    getDashboardMetrics, getActivity, activateClient, updateTenant, getTenants,
    getNotifications, markNotificationRead, markAllNotificationsRead, convertLeadToTenant,
    getSystemConfig, updateSystemConfig, getPlans, updatePlan, getSubscriptionClients,
    getReportConversion, getReportSubscriptions, getReportRevenue
} from '../controllers/admin.controller';
import { getLeads, getLead, updateLead, deleteLead } from '../controllers/lead.controller';

const router = Router();

// Middleware
router.use(isAuthenticated, requireSuperAdmin);

// Dashboard
// router.get('/stats', getStats); // Deprecated
router.get('/dashboard/metrics', getDashboardMetrics);
router.get('/activity', getActivity);

// Leads
router.get('/leads', getLeads);
router.get('/leads/:id', getLead);
router.patch('/leads/:id', updateLead);
router.delete('/leads/:id', deleteLead);

// Activation (Manual)
router.post('/activate', activateClient);
router.post('/leads/:id/convert', convertLeadToTenant);

// Tenant Management
router.patch('/tenants/:id', updateTenant);
router.get('/tenants', getTenants);

// Notifications
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);
router.patch('/notifications/read-all', markAllNotificationsRead);


// Subscriptions & Clients
router.get('/subscriptions/clients', getSubscriptionClients);
// router.get('/users', (req, res) => res.json([]));

// System Config
router.get('/config', getSystemConfig);
router.put('/config', updateSystemConfig);

// Plan Management
router.get('/plans', getPlans);
router.put('/plans/:tier', updatePlan);

// Reports
router.get('/reports/conversion', getReportConversion);
router.get('/reports/subscriptions', getReportSubscriptions);
router.get('/reports/revenue', getReportRevenue);

export default router;
