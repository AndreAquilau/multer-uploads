import { Router } from 'express';
import LoginController from '../controllers/LoginController';

const router = Router();

router.post('/', LoginController.store);

export default router;
