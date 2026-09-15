import express from 'express';
import { addOrderItems, getMyOrders, getOrders, updateOrderToDelivered, updateOrderStatus } from '../controllers/orderController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/').post(protect as any, addOrderItems).get(protect as any, admin as any, getOrders);
router.route('/myorders').get(protect as any, getMyOrders);

router.route('/:id/deliver').put(protect as any, admin as any, updateOrderToDelivered);

router.route('/:id/status').put(protect as any, admin as any, updateOrderStatus);

export default router;
