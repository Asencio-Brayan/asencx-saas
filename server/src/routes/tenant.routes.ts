import { Router, type Request, type Response } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', isAuthenticated, (req: Request, res: Response) => {
    res.json({ message: 'Tenants route' });
});

export default router;
