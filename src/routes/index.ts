import { Router } from 'express';
import userRoutes from './users.routes';
import photoRoutes from './photo.routes';
import loginRoutes from './login.routes';
const router = Router();

router.use('/users', userRoutes);
router.use('/tokens', loginRoutes);
router.use('/photos', photoRoutes);

export default router;
