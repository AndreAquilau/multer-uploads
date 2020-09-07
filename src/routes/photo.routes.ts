import { Router } from 'express';
import photoController from '../controllers/PhotoController';
import authorization from '../middleware/authorization';

const router = Router();

router.use(authorization);
router.post('/', photoController.store);
router.get('/', photoController.index);
router.get('/:nome', photoController.show);
router.delete('/:nome', photoController.delete);
router.put('/:nome', photoController.update);

export default router;
