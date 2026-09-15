import express from 'express';
import { getCart, updateCartItem, mergeCart, clearCart } from '../controllers/cartController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/').get(protect as any, getCart).post(protect as any, updateCartItem).delete(protect as any, clearCart);
router.post('/merge', protect as any, mergeCart);

export default router;
