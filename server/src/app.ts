import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorMiddleware } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/lead.routes';
import adminRoutes from './routes/admin.routes';
import tenantRoutes from './routes/tenant.routes';
import publicRoutes from './routes/public.routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/public', publicRoutes);

app.use(errorMiddleware);

export default app;
