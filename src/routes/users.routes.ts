import { Router } from 'express';
import userController from '../controllers/UserController';
import authorization from '../middleware/authorization';

const router = Router();

router.post('/', userController.store);
router.use(authorization);
router.get('/', userController.index);
router.get('/', userController.show);
router.delete('/', userController.delete);
router.put('/', userController.update);

export default router;
