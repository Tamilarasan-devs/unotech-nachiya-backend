import express from 'express';
import { getWishlist, toggleWishlist, mergeWishlist } from '../controllers/wishlistController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/').get(protect as any, getWishlist).post(protect as any, toggleWishlist);
router.post('/merge', protect as any, mergeWishlist);

export default router;
