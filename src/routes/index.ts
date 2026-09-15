import express from 'express';
import userRoutes from './userRoutes';
import productRoutes from './productRoutes';
import uploadRoutes from './uploadRoutes';

import cartRoutes from './cartRoutes';
import wishlistRoutes from './wishlistRoutes';
import orderRoutes from './orderRoutes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/upload', uploadRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/orders', orderRoutes);

export default router;
