// routes/index.js: Agrège et monte les routes des différentes fonctionnalités
import { Router } from 'express';
import healthRoutes from './health.routes.js';
import userRoutes from '../user/user.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/users', userRoutes);

export default router;


