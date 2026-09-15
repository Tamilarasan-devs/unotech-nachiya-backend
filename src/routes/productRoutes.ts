import express from 'express';
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
} from '../controllers/productController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect as any, admin as any, createProduct as any);

router.route('/:id')
  .get(getProductById as any)
  .put(protect as any, admin as any, updateProduct as any)
  .delete(protect as any, admin as any, deleteProduct as any);

export default router;
