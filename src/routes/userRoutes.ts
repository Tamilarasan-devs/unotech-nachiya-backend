import { Router } from 'express';
import { authUser, registerUser, getUsers, deleteUser } from '../controllers/userController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', registerUser);
router.post('/login', authUser);
router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);

export default router;
